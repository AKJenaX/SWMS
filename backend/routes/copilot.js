import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { requireFeature } from '../middleware/featureFlags.js';
import { executeQuery } from '../db.js';

const router = express.Router();

function mapQuestionToQuery(question) {
  const q = String(question || '').toLowerCase();

  if (q.includes('high-risk bins') || q.includes('risk')) {
    return {
      metric: 'high_risk_bins_next_6h',
      sql: `SELECT bin_id, MAX(fill_pct) AS latest_fill_pct
            FROM telemetry_events
            WHERE device_ts >= DATE_SUB(NOW(), INTERVAL 6 HOUR)
            GROUP BY bin_id
            HAVING latest_fill_pct >= 85
            ORDER BY latest_fill_pct DESC
            LIMIT 20`
    };
  }

  if (q.includes('sla')) {
    return {
      metric: 'sla_breach_by_severity',
      sql: `SELECT severity, COUNT(*) AS active_count
            FROM incidents
            WHERE status NOT IN ('resolved', 'closed')
            GROUP BY severity`
    };
  }

  return {
    metric: 'incident_summary',
    sql: `SELECT status, COUNT(*) AS count
          FROM incidents
          GROUP BY status`
  };
}

router.post(
  '/query',
  requireFeature('ENABLE_COPILOT'),
  requireAuth,
  requirePermission('copilot.read'),
  asyncHandler(async (req, res) => {
    const { question } = req.body || {};
    const queryPlan = mapQuestionToQuery(question);
    const [rows] = await executeQuery(queryPlan.sql);
    res.json({
      mode: 'read-only',
      metric: queryPlan.metric,
      answer: rows
    });
  })
);

export default router;
