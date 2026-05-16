import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { executeQuery } from '../db.js';

const router = express.Router();
const VALID_STATES = ['open', 'triaged', 'assigned', 'in_progress', 'resolved', 'closed'];

router.post(
  '/',
  requireAuth,
  requirePermission('incident.write'),
  asyncHandler(async (req, res) => {
    const { incident_type, severity, bin_id, description } = req.body || {};
    const [result] = await executeQuery(
      `INSERT INTO incidents (incident_type, severity, status, bin_id, description)
       VALUES (?, ?, 'open', ?, ?)`,
      [incident_type, severity, bin_id || null, description || null]
    );
    res.json({ message: 'Incident created', id: result.insertId });
  })
);

router.get(
  '/',
  requireAuth,
  requirePermission('incident.read'),
  asyncHandler(async (_req, res) => {
    const [rows] = await executeQuery('SELECT * FROM incidents ORDER BY id DESC');
    res.json(rows);
  })
);

router.put(
  '/:id/state',
  requireAuth,
  requirePermission('incident.write'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body || {};
    if (!VALID_STATES.includes(status)) {
      return res.status(400).json({ code: 'VALIDATION_ERROR', message: 'Invalid incident state' });
    }

    await executeQuery('UPDATE incidents SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Incident state updated' });
  })
);

router.post(
  '/:id/assign',
  requireAuth,
  requirePermission('incident.assign'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { driver_id, vehicle_id, authority_id } = req.body || {};

    await executeQuery(
      `INSERT INTO incident_assignments (incident_id, driver_id, vehicle_id, authority_id)
       VALUES (?, ?, ?, ?)`,
      [id, driver_id || null, vehicle_id || null, authority_id || null]
    );
    await executeQuery('UPDATE incidents SET status = ? WHERE id = ?', ['assigned', id]);
    res.json({ message: 'Incident assigned' });
  })
);

router.get(
  '/dispatch/queue',
  requireAuth,
  requirePermission('incident.read'),
  asyncHandler(async (_req, res) => {
    const [rows] = await executeQuery(
      `SELECT i.*,
              TIMESTAMPDIFF(MINUTE, i.opened_at, NOW()) AS age_minutes
       FROM incidents i
       WHERE i.status IN ('open', 'triaged', 'assigned', 'in_progress')
       ORDER BY FIELD(i.severity, 'critical', 'high', 'medium', 'low'), age_minutes DESC`
    );
    res.json(rows);
  })
);

export default router;
