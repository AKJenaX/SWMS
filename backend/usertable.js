import express from 'express';
import { db } from './db.js';
import { asyncHandler } from './middleware/asyncHandler.js';
import { requireAuth, requirePermission } from './middleware/auth.js';
import { auditAction } from './middleware/audit.js';
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM UserTable');
  res.json(rows);
}));

router.post('/add', requireAuth, requirePermission('user.write'), auditAction('create', 'User', (_req, body) => body.id), asyncHandler(async (req, res) => {
  const { Mobile_Number, House_Number, Vehicle_ID } = req.body;
  const [result] = await db.execute(
    'INSERT INTO UserTable (Mobile_Number, House_Number, Vehicle_ID) VALUES (?, ?, ?)',
    [Mobile_Number, House_Number, Vehicle_ID]
  );
  res.json({ message: 'User added', id: result.insertId });
}));

router.put('/update/:id', requireAuth, requirePermission('user.write'), auditAction('update', 'User'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { Mobile_Number, House_Number, Vehicle_ID } = req.body;
  await db.execute(
    'UPDATE UserTable SET Mobile_Number=?, House_Number=?, Vehicle_ID=? WHERE User_ID=?',
    [Mobile_Number, House_Number, Vehicle_ID, id]
  );
  res.json({ message: 'User updated' });
}));

router.delete('/delete/:id', requireAuth, requirePermission('user.delete'), auditAction('delete', 'User'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM UserTable WHERE User_ID=?', [id]);
  res.json({ message: 'User deleted' });
}));

export default router;
