import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { executeQuery } from '../db.js';

const router = express.Router();

router.get(
  '/',
  requireAuth,
  requireRole('super_admin', 'zonal_manager'),
  asyncHandler(async (req, res) => {
    const [rows] = await executeQuery(
      `SELECT id, actor_id, actor_role, action, entity_name, entity_id, request_id, ip_address, created_at
       FROM audit_logs
       ORDER BY id DESC
       LIMIT 500`
    );
    res.json(rows);
  })
);

export default router;
