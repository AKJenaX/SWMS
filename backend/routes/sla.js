import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { executeQuery } from '../db.js';

const router = express.Router();

router.post(
  '/policies',
  requireAuth,
  requirePermission('sla.manage'),
  asyncHandler(async (req, res) => {
    const { zone_name, severity, target_minutes, escalation_minutes, is_active = true } = req.body || {};
    const [result] = await executeQuery(
      `INSERT INTO sla_policies (zone_name, severity, target_minutes, escalation_minutes, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [zone_name, severity, target_minutes, escalation_minutes, Boolean(is_active)]
    );
    res.json({ message: 'SLA policy created', id: result.insertId });
  })
);

router.get(
  '/metrics',
  requireAuth,
  requirePermission('sla.read'),
  asyncHandler(async (_req, res) => {
    const [[totals]] = await executeQuery(
      `SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status NOT IN ('resolved','closed') THEN 1 ELSE 0 END) AS active,
        SUM(CASE WHEN DATE(opened_at) = CURDATE() AND status NOT IN ('resolved','closed') THEN 1 ELSE 0 END) AS opened_today
       FROM incidents`
    );
    const [[breaches]] = await executeQuery(
      `SELECT COUNT(*) AS count
       FROM incidents i
       JOIN sla_policies sp ON sp.severity = i.severity AND sp.is_active = true
       WHERE i.status NOT IN ('resolved', 'closed')
       AND TIMESTAMPDIFF(MINUTE, i.opened_at, NOW()) >= sp.target_minutes`
    );
    const [[atRisk]] = await executeQuery(
      `SELECT COUNT(*) AS count
       FROM incidents i
       JOIN sla_policies sp ON sp.severity = i.severity AND sp.is_active = true
       WHERE i.status NOT IN ('resolved', 'closed')
       AND TIMESTAMPDIFF(MINUTE, i.opened_at, NOW()) BETWEEN GREATEST(sp.target_minutes - 60, 0) AND sp.target_minutes`
    );

    const total = Number(totals.total || 0);
    const breached = Number(breaches.count || 0);
    res.json({
      overallCompliance: total ? Math.max(0, Math.round(((total - breached) / total) * 100)) : 100,
      activeIncidents: Number(totals.active || 0),
      breachedToday: breached,
      atRisk: Number(atRisk.count || 0),
      openedToday: Number(totals.opened_today || 0)
    });
  })
);

router.get(
  '/policies',
  requireAuth,
  requirePermission('sla.read'),
  asyncHandler(async (_req, res) => {
    const [rows] = await executeQuery('SELECT * FROM sla_policies ORDER BY id DESC');
    res.json(rows);
  })
);

router.get(
  '/escalations/pending',
  requireAuth,
  requirePermission('sla.read'),
  asyncHandler(async (_req, res) => {
    const [rows] = await executeQuery(
      `SELECT i.id AS incident_id, i.severity, i.status, i.opened_at,
              sp.target_minutes, sp.escalation_minutes,
              TIMESTAMPDIFF(MINUTE, i.opened_at, NOW()) AS age_minutes
       FROM incidents i
       JOIN sla_policies sp ON sp.severity = i.severity AND sp.is_active = true
       WHERE i.status NOT IN ('resolved', 'closed')
       HAVING age_minutes >= sp.escalation_minutes
       ORDER BY age_minutes DESC`
    );
    res.json(rows);
  })
);

export default router;
