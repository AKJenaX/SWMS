import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { requireFeature } from '../middleware/featureFlags.js';
import { executeQuery } from '../db.js';
import { publishEvent } from '../events/eventBus.js';
import { eventBus } from '../events/eventBus.js';

const router = express.Router();

function statusFor(row) {
  const fill = Number(row.fill_pct || 0);
  const battery = Number(row.battery_pct || 0);
  if (row.smoke_detected || row.tilt_detected || fill >= 90 || battery <= 15) return 'critical';
  if (fill >= 75 || battery <= 35) return 'warning';
  return 'healthy';
}

function normalizeTelemetry(row) {
  return {
    id: row.bin_id || row.id,
    telemetry_id: row.id,
    bin_id: row.bin_id,
    fill_pct: Number(row.fill_pct || 0),
    smoke_detected: Boolean(row.smoke_detected),
    tilt_detected: Boolean(row.tilt_detected),
    battery_pct: Number(row.battery_pct || 0),
    temperature: Number(row.temperature || 26),
    gps_lat: row.gps_lat === null ? null : Number(row.gps_lat),
    gps_lng: row.gps_lng === null ? null : Number(row.gps_lng),
    status: statusFor(row),
    last_update: row.created_at || row.device_ts || new Date()
  };
}

async function ingestOne(event) {
  const [result] = await executeQuery(
    `INSERT INTO telemetry_events
      (bin_id, fill_pct, smoke_detected, tilt_detected, battery_pct, gps_lat, gps_lng, source_device, device_ts)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      event.bin_id || null,
      event.fill_pct ?? null,
      Boolean(event.smoke_detected),
      Boolean(event.tilt_detected),
      event.battery_pct ?? null,
      event.gps_lat ?? null,
      event.gps_lng ?? null,
      event.source_device || null,
      event.device_ts || null
    ]
  );

  publishEvent('telemetry.ingested', {
    telemetryId: result.insertId,
    ...event
  });
  return result.insertId;
}

router.get(
  '/telemetry',
  requireFeature('ENABLE_IOT'),
  requireAuth,
  requirePermission('iot.ingest'),
  asyncHandler(async (_req, res) => {
    const [rows] = await executeQuery(
      `SELECT te.*
       FROM telemetry_events te
       JOIN (
         SELECT bin_id, MAX(id) AS max_id
         FROM telemetry_events
         WHERE bin_id IS NOT NULL
         GROUP BY bin_id
       ) latest ON latest.max_id = te.id
       ORDER BY te.created_at DESC
       LIMIT 100`
    );
    res.json(rows.map(normalizeTelemetry));
  })
);

router.get(
  '/telemetry/bin/:binId',
  requireFeature('ENABLE_IOT'),
  requireAuth,
  requirePermission('iot.ingest'),
  asyncHandler(async (req, res) => {
    const [rows] = await executeQuery(
      `SELECT *
       FROM telemetry_events
       WHERE bin_id = ?
       ORDER BY id DESC
       LIMIT 50`,
      [req.params.binId]
    );
    res.json(rows.map(normalizeTelemetry));
  })
);

router.get(
  '/alerts',
  requireFeature('ENABLE_IOT'),
  requireAuth,
  requirePermission('iot.ingest'),
  asyncHandler(async (_req, res) => {
    const [rows] = await executeQuery(
      `SELECT a.id, a.alert_type, a.severity, a.status, a.details_json, a.created_at, i.bin_id
       FROM alerts a
       LEFT JOIN incidents i ON i.id = a.incident_id
       WHERE a.status = 'open'
       ORDER BY a.id DESC
       LIMIT 50`
    );
    res.json(rows.map((row) => ({
      id: row.id,
      type: row.alert_type,
      severity: row.severity,
      status: row.status,
      bin_id: row.bin_id,
      message: row.details_json ? 'Sensor threshold exceeded' : 'Operational alert',
      created_at: row.created_at
    })));
  })
);

router.get(
  '/telemetry/stream',
  requireFeature('ENABLE_IOT'),
  requireAuth,
  requirePermission('iot.ingest'),
  asyncHandler(async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const send = (event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    };
    eventBus.on('telemetry.ingested', send);
    req.on('close', () => {
      eventBus.off('telemetry.ingested', send);
    });
  })
);

router.post(
  '/events',
  requireFeature('ENABLE_IOT'),
  requireAuth,
  requirePermission('iot.ingest'),
  asyncHandler(async (req, res) => {
    const id = await ingestOne(req.body || {});
    res.json({ message: 'Telemetry event ingested', id });
  })
);

router.post(
  '/events/batch',
  requireFeature('ENABLE_IOT'),
  requireAuth,
  requirePermission('iot.ingest'),
  asyncHandler(async (req, res) => {
    const events = Array.isArray(req.body?.events) ? req.body.events : [];
    const ids = [];
    for (const event of events) {
      ids.push(await ingestOne(event));
    }
    res.json({ message: 'Telemetry batch ingested', count: ids.length, ids });
  })
);

export default router;
