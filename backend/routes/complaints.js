import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, requirePermission } from '../middleware/auth.js';
import { executeQuery } from '../db.js';
import { auditAction } from '../middleware/audit.js';

const router = express.Router();

function priorityFromEta(eta) {
  const minutes = Number(eta || 180);
  if (minutes <= 60) return 'high';
  if (minutes <= 120) return 'medium';
  return 'low';
}

async function commentsForComplaint(id) {
  try {
    const [comments] = await executeQuery(
      `SELECT author, comment_text AS text, created_at
       FROM complaint_comments
       WHERE complaint_id = ?
       ORDER BY id ASC`,
      [id]
    );
    return comments;
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') return [];
    throw error;
  }
}

async function formatComplaint(row, includeComments = false) {
  const complaint = {
    ...row,
    subject: `Complaint #${row.id}`,
    description: row.message,
    submitter_name: row.citizen_name || 'Citizen',
    priority: priorityFromEta(row.eta_minutes)
  };
  if (includeComments) {
    complaint.comments = await commentsForComplaint(row.id);
  }
  return complaint;
}

function estimateEtaMinutes(severity) {
  switch (severity) {
    case 'critical':
      return 30;
    case 'high':
      return 60;
    case 'medium':
      return 120;
    default:
      return 180;
  }
}

router.post(
  '/',
  requireAuth,
  requirePermission('complaint.write'),
  auditAction('create', 'Complaint', (_req, body) => body.id),
  asyncHandler(async (req, res) => {
    const { citizen_name, phone, message, gps_lat, gps_lng, severity = 'medium' } = req.body || {};
    const eta_minutes = estimateEtaMinutes(severity);

    const [result] = await executeQuery(
      `INSERT INTO complaints (citizen_name, phone, message, gps_lat, gps_lng, eta_minutes, status)
       VALUES (?, ?, ?, ?, ?, ?, 'open')`,
      [citizen_name || null, phone || null, message, gps_lat || null, gps_lng || null, eta_minutes]
    );
    res.json({ message: 'Complaint created', id: result.insertId, eta_minutes });
  })
);

router.get(
  '/',
  requireAuth,
  requirePermission('complaint.read'),
  asyncHandler(async (req, res) => {
    const params = [];
    let sql = 'SELECT * FROM complaints';
    if (req.query.status) {
      sql += ' WHERE status = ?';
      params.push(req.query.status);
    }
    sql += ' ORDER BY id DESC';
    const [rows] = await executeQuery(sql, params);
    const complaints = [];
    for (const row of rows) {
      complaints.push(await formatComplaint(row, true));
    }
    res.json(complaints);
  })
);

router.get(
  '/:id',
  requireAuth,
  requirePermission('complaint.read'),
  asyncHandler(async (req, res) => {
    const [rows] = await executeQuery('SELECT * FROM complaints WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ code: 'NOT_FOUND', message: 'Complaint not found' });
    }
    return res.json(await formatComplaint(rows[0], true));
  })
);

router.put(
  '/:id',
  requireAuth,
  requirePermission('complaint.write'),
  auditAction('update', 'Complaint'),
  asyncHandler(async (req, res) => {
    const { status, notes } = req.body || {};
    if (status) {
      await executeQuery('UPDATE complaints SET status = ? WHERE id = ?', [status, req.params.id]);
    }
    if (notes) {
      try {
        await executeQuery(
          'INSERT INTO complaint_comments (complaint_id, author, comment_text) VALUES (?, ?, ?)',
          [req.params.id, req.user?.userId ? `User ${req.user.userId}` : 'System', notes]
        );
      } catch (error) {
        if (error.code !== 'ER_NO_SUCH_TABLE') throw error;
      }
    }
    res.json({ message: 'Complaint updated' });
  })
);

router.post(
  '/:id/comment',
  requireAuth,
  requirePermission('complaint.write'),
  auditAction('comment', 'Complaint'),
  asyncHandler(async (req, res) => {
    try {
      await executeQuery(
        'INSERT INTO complaint_comments (complaint_id, author, comment_text) VALUES (?, ?, ?)',
        [req.params.id, req.user?.userId ? `User ${req.user.userId}` : 'System', req.body?.comment || '']
      );
    } catch (error) {
      if (error.code !== 'ER_NO_SUCH_TABLE') throw error;
      return res.status(503).json({
        code: 'MIGRATION_REQUIRED',
        message: 'Run backend migrations to enable complaint comments'
      });
    }
    return res.json({ message: 'Comment added' });
  })
);

router.put(
  '/:id/status',
  requireAuth,
  requirePermission('complaint.write'),
  auditAction('update_status', 'Complaint'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body || {};
    await executeQuery('UPDATE complaints SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Complaint status updated' });
  })
);

router.put(
  '/:id/closure',
  requireAuth,
  requirePermission('complaint.write'),
  auditAction('close', 'Complaint'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { closure_proof } = req.body || {};
    await executeQuery(
      'UPDATE complaints SET closure_proof = ?, status = ? WHERE id = ?',
      [closure_proof || null, 'closed', id]
    );
    res.json({ message: 'Complaint closed with proof' });
  })
);

export default router;
