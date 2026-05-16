import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { requireFeature } from '../middleware/featureFlags.js';
import { executeQuery } from '../db.js';

const router = express.Router();

async function buildForecast(binId) {
    const [rows] = await executeQuery(
      `SELECT fill_pct
       FROM telemetry_events
       WHERE bin_id = ? AND fill_pct IS NOT NULL
       ORDER BY id DESC
       LIMIT 12`,
      [binId]
    );

    const values = rows.map((r) => Number(r.fill_pct)).reverse();
    const latest = values.length ? values[values.length - 1] : 0;
    const deltas = values.slice(1).map((v, idx) => v - values[idx]);
    const avgGrowth = deltas.length ? deltas.reduce((a, b) => a + b, 0) / deltas.length : 0;

    const forecast = (hours) => Math.max(0, Math.min(100, latest + avgGrowth * hours));
    return {
      binId: Number(binId),
      latestFillPct: latest,
      growthPerHour: avgGrowth,
      risk_6h: forecast(6),
      risk_12h: forecast(12),
      risk_24h: forecast(24)
    };
}

router.get(
  '/all',
  requireFeature('ENABLE_OPTIMIZATION'),
  requireAuth,
  requirePermission('forecast.read'),
  asyncHandler(async (_req, res) => {
    const [bins] = await executeQuery(
      `SELECT DISTINCT bin_id
       FROM telemetry_events
       WHERE bin_id IS NOT NULL
       ORDER BY bin_id
       LIMIT 100`
    );
    const forecasts = [];
    for (const row of bins) {
      forecasts.push(await buildForecast(row.bin_id));
    }
    res.json(forecasts);
  })
);

router.get(
  '/trend/:binId',
  requireFeature('ENABLE_OPTIMIZATION'),
  requireAuth,
  requirePermission('forecast.read'),
  asyncHandler(async (req, res) => {
    const { binId } = req.params;
    const days = Math.max(1, Math.min(Number(req.query.days || 7), 30));
    const [rows] = await executeQuery(
      `SELECT fill_pct, created_at
       FROM telemetry_events
       WHERE bin_id = ? AND fill_pct IS NOT NULL AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       ORDER BY created_at ASC`,
      [binId, days]
    );
    res.json(rows);
  })
);

router.get(
  '/bin/:binId',
  requireFeature('ENABLE_OPTIMIZATION'),
  requireAuth,
  requirePermission('forecast.read'),
  asyncHandler(async (req, res) => {
    res.json(await buildForecast(req.params.binId));
  })
);

export default router;
