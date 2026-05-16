import express from 'express';
import { db } from './db.js';
import { asyncHandler } from './middleware/asyncHandler.js';
import { requireAuth, requirePermission } from './middleware/auth.js';
import { auditAction } from './middleware/audit.js';
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM Driver');
  res.json(rows);
}));

router.post('/add', requireAuth, requirePermission('driver.write'), auditAction('create', 'Driver', (_req, body) => body.id), asyncHandler(async (req, res) => {
  const { Name, Address, Control_Number, Duty_Per_Order_ID, Vehicle_ID, Authority_ID } = req.body;
  const [result] = await db.execute(
    'INSERT INTO Driver (Name, Address, Control_Number, Duty_Per_Order_ID, Vehicle_ID, Authority_ID) VALUES (?, ?, ?, ?, ?, ?)',
    [Name, Address, Control_Number, Duty_Per_Order_ID, Vehicle_ID, Authority_ID]
  );
  res.json({ message: 'Driver added', id: result.insertId });
}));

router.put('/update/:id', requireAuth, requirePermission('driver.write'), auditAction('update', 'Driver'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { Name, Address, Control_Number, Duty_Per_Order_ID, Vehicle_ID, Authority_ID } = req.body;
  await db.execute(
    'UPDATE Driver SET Name=?, Address=?, Control_Number=?, Duty_Per_Order_ID=?, Vehicle_ID=?, Authority_ID=? WHERE Driver_ID=?',
    [Name, Address, Control_Number, Duty_Per_Order_ID, Vehicle_ID, Authority_ID, id]
  );
  res.json({ message: 'Driver updated' });
}));

router.delete('/delete/:id', requireAuth, requirePermission('driver.delete'), auditAction('delete', 'Driver'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM Driver WHERE Driver_ID=?', [id]);
  res.json({ message: 'Driver deleted' });
}));

export default router;
