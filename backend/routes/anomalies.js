import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { requireFeature } from '../middleware/featureFlags.js';
import { executeQuery } from '../db.js';

const router = express.Router();

async function getDetectedAnomalies() {
  const [sensorRows] = await executeQuery(
    `SELECT bin_id,
            COUNT(*) AS total_points,
            MIN(fill_pct) AS min_fill,
            MAX(fill_pct) AS max_fill,
            MAX(created_at) AS detected_at
     FROM telemetry_events
     WHERE bin_id IS NOT NULL
     GROUP BY bin_id
     HAVING total_points >= 5 AND (max_fill - min_fill) < 1`
  );

  const [routeRows] = await executeQuery(
    `SELECT id, bin_id, incident_type, severity, status, opened_at, description
     FROM incidents
     WHERE incident_type IN ('route_anomaly', 'overflow_risk', 'hazard_alert')
     ORDER BY id DESC
     LIMIT 50`
  );

  const [reviews] = await executeQuery('SELECT * FROM anomaly_reviews');
  const reviewById = new Map(reviews.map((review) => [review.anomaly_id, review]));

  const sensorAnomalies = sensorRows.map((row) => {
    const id = `sensor-${row.bin_id}`;
    const review = reviewById.get(id);
    return {
      id,
      type: 'Sensor drift',
      severity: 'medium',
      bin_id: row.bin_id,
      detected_at: row.detected_at || new Date(),
      description: 'Fill readings are nearly unchanged across recent telemetry samples.',
      metrics: {
        samples: Number(row.total_points || 0),
        minFill: Number(row.min_fill || 0),
        maxFill: Number(row.max_fill || 0)
      },
      reviewed: Boolean(review),
      review_notes: review?.review_notes || null
    };
  });

  const routeAnomalies = routeRows.map((row) => {
    const id = `incident-${row.id}`;
    const review = reviewById.get(id);
    return {
      id,
      type: row.incident_type,
      severity: row.severity || 'medium',
      bin_id: row.bin_id,
      detected_at: row.opened_at,
      description: row.description || `Incident status: ${row.status}`,
      metrics: {
        incidentId: row.id,
        status: row.status
      },
      reviewed: Boolean(review),
      review_notes: review?.review_notes || null
    };
  });

  return [...routeAnomalies, ...sensorAnomalies];
}

router.get(
  '/list',
  requireFeature('ENABLE_OPTIMIZATION'),
  requireAuth,
  requirePermission('anomaly.read'),
  asyncHandler(async (_req, res) => {
    res.json(await getDetectedAnomalies());
  })
);

router.get(
  '/:anomalyId',
  requireFeature('ENABLE_OPTIMIZATION'),
  requireAuth,
  requirePermission('anomaly.read'),
  asyncHandler(async (req, res) => {
    const anomaly = (await getDetectedAnomalies()).find((item) => item.id === req.params.anomalyId);
    if (!anomaly) {
      return res.status(404).json({ code: 'NOT_FOUND', message: 'Anomaly not found' });
    }
    return res.json(anomaly);
  })
);

router.put(
  '/:anomalyId/review',
  requireFeature('ENABLE_OPTIMIZATION'),
  requireAuth,
  requirePermission('anomaly.read'),
  asyncHandler(async (req, res) => {
    await executeQuery(
      `INSERT INTO anomaly_reviews (anomaly_id, review_notes, reviewed_by, reviewed_at)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE review_notes = VALUES(review_notes), reviewed_by = VALUES(reviewed_by), reviewed_at = NOW()`,
      [req.params.anomalyId, req.body?.notes || null, req.user?.userId || null]
    );
    res.json({ message: 'Anomaly reviewed' });
  })
);

router.get(
  '/sensors',
  requireFeature('ENABLE_OPTIMIZATION'),
  requireAuth,
  requirePermission('anomaly.read'),
  asyncHandler(async (_req, res) => {
    const [rows] = await executeQuery(
      `SELECT bin_id,
              COUNT(*) AS total_points,
              MIN(fill_pct) AS min_fill,
              MAX(fill_pct) AS max_fill
       FROM telemetry_events
       GROUP BY bin_id
       HAVING total_points >= 5 AND (max_fill - min_fill) < 1`
    );
    res.json({
      type: 'sensor_drift',
      anomalies: rows
    });
  })
);

router.get(
  '/routes',
  requireFeature('ENABLE_OPTIMIZATION'),
  requireAuth,
  requirePermission('anomaly.read'),
  asyncHandler(async (_req, res) => {
    const [rows] = await executeQuery(
      `SELECT id, incident_type, severity, status, opened_at
       FROM incidents
       WHERE incident_type = 'route_anomaly'
       ORDER BY id DESC`
    );
    res.json({
      type: 'route_anomaly',
      anomalies: rows
    });
  })
);

export default router;
