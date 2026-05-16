import express from 'express';
import { db } from './db.js';
import { asyncHandler } from './middleware/asyncHandler.js';
import { requireAuth, requirePermission } from './middleware/auth.js';
import { auditAction } from './middleware/audit.js';
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM Authority');
  res.json(rows);
}));

router.post('/add', requireAuth, requirePermission('authority.write'), auditAction('create', 'Authority', (_req, body) => body.id), asyncHandler(async (req, res) => {
  const { Name, Designation, Control_Room, Works_Under } = req.body;
  const [result] = await db.execute(
    'INSERT INTO Authority (Name, Designation, Control_Room, Works_Under) VALUES (?, ?, ?, ?)',
    [Name, Designation, Control_Room, Works_Under || null]
  );
  res.json({ message: 'Authority added', id: result.insertId });
}));

router.put('/update/:id', requireAuth, requirePermission('authority.write'), auditAction('update', 'Authority'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { Name, Designation, Control_Room, Works_Under } = req.body;
  await db.execute(
    'UPDATE Authority SET Name=?, Designation=?, Control_Room=?, Works_Under=? WHERE Authority_ID=?',
    [Name, Designation, Control_Room, Works_Under || null, id]
  );
  res.json({ message: 'Authority updated' });
}));

router.delete('/delete/:id', requireAuth, requirePermission('authority.delete'), auditAction('delete', 'Authority'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM Authority WHERE Authority_ID=?', [id]);
  res.json({ message: 'Authority deleted' });
}));

export default router;
