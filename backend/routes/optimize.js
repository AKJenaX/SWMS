import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { requireFeature } from '../middleware/featureFlags.js';
import { executeQuery } from '../db.js';

const router = express.Router();

function scoreStop(stop) {
  const fillWeight = Number(stop.fill_pct || 0) * 0.6;
  const priorityWeight = Number(stop.priority || 0) * 25;
  const distancePenalty = Number(stop.distance_km || 0) * -2;
  return fillWeight + priorityWeight + distancePenalty;
}

router.get(
  '/routes',
  requireFeature('ENABLE_OPTIMIZATION'),
  requireAuth,
  requirePermission('optimization.read'),
  asyncHandler(async (_req, res) => {
    const [rows] = await executeQuery(
      `SELECT te.bin_id,
              te.fill_pct,
              te.battery_pct,
              te.smoke_detected,
              te.tilt_detected,
              te.gps_lat,
              te.gps_lng,
              te.created_at
       FROM telemetry_events te
       JOIN (
         SELECT bin_id, MAX(id) AS max_id
         FROM telemetry_events
         WHERE bin_id IS NOT NULL
         GROUP BY bin_id
       ) latest ON latest.max_id = te.id
       ORDER BY te.fill_pct DESC, te.created_at DESC
       LIMIT 12`
    );

    const stops = rows.map((row, index) => ({
      bin_id: row.bin_id,
      fill_pct: Number(row.fill_pct || 0),
      priority: row.smoke_detected || row.tilt_detected || Number(row.fill_pct || 0) >= 90 ? 3 : Number(row.fill_pct || 0) >= 75 ? 2 : 1,
      distance_km: Number((2.5 + index * 1.7).toFixed(1)),
      estimated_load: Math.max(5, Math.round(Number(row.fill_pct || 0) / 10)),
      gps_lat: row.gps_lat,
      gps_lng: row.gps_lng
    }));

    const routes = [0, 1]
      .map((routeIndex) => {
        const routeStops = stops.filter((_, index) => index % 2 === routeIndex);
        return {
          id: routeIndex + 1,
          vehicle_id: routeIndex + 1,
          stops: routeStops,
          distance: routeStops.reduce((sum, stop) => sum + Number(stop.distance_km || 0), 0)
        };
      })
      .filter((route) => route.stops.length > 0);

    res.json(routes);
  })
);

router.post(
  '/route-plan',
  requireFeature('ENABLE_OPTIMIZATION'),
  requireAuth,
  requirePermission('optimization.read'),
  asyncHandler(async (req, res) => {
    const { vehicle_capacity = 0, stops = [] } = req.body || {};
    const ranked = [...stops].sort((a, b) => scoreStop(b) - scoreStop(a));
    const selected = [];
    let usedCapacity = 0;

    for (const stop of ranked) {
      const load = Number(stop.estimated_load || 0);
      if (usedCapacity + load <= Number(vehicle_capacity)) {
        selected.push(stop);
        usedCapacity += load;
      }
    }

    const estimatedDistanceKm = selected.reduce((sum, stop) => sum + Number(stop.distance_km || 0), 0);
    res.json({
      sequence: selected,
      usedCapacity,
      estimatedDistanceKm,
      estimatedDurationMin: Math.round((estimatedDistanceKm / 25) * 60)
    });
  })
);

export default router;
