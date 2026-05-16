import express from 'express';
import { db } from './db.js';
import { asyncHandler } from './middleware/asyncHandler.js';
import { requireAuth, requirePermission } from './middleware/auth.js';
import { auditAction } from './middleware/audit.js';
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM Vehicle');
  res.json(rows);
}));

router.post('/add', requireAuth, requirePermission('vehicle.write'), auditAction('create', 'Vehicle', (_req, body) => body.id), asyncHandler(async (req, res) => {
  const { Vehicle_Number, Vehicle_Type, Manufacturer, Assigned_Location, Authority_ID } = req.body;
  const [result] = await db.execute(
    'INSERT INTO Vehicle (Vehicle_Number, Vehicle_Type, Manufacturer, Assigned_Location, Authority_ID) VALUES (?, ?, ?, ?, ?)',
    [Vehicle_Number, Vehicle_Type, Manufacturer, Assigned_Location, Authority_ID]
  );
  res.json({ message: 'Vehicle added', id: result.insertId });
}));

router.put('/update/:id', requireAuth, requirePermission('vehicle.write'), auditAction('update', 'Vehicle'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { Vehicle_Number, Vehicle_Type, Manufacturer, Assigned_Location, Authority_ID } = req.body;
  await db.execute(
    'UPDATE Vehicle SET Vehicle_Number=?, Vehicle_Type=?, Manufacturer=?, Assigned_Location=?, Authority_ID=? WHERE Vehicle_ID=?',
    [Vehicle_Number, Vehicle_Type, Manufacturer, Assigned_Location, Authority_ID, id]
  );
  res.json({ message: 'Vehicle updated' });
}));

router.delete('/delete/:id', requireAuth, requirePermission('vehicle.delete'), auditAction('delete', 'Vehicle'), asyncHandler(async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM Vehicle WHERE Vehicle_ID=?', [id]);
  res.json({ message: 'Vehicle deleted' });
}));

export default router;
