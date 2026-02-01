import express from 'express';
import { db } from './db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM Bin');
  res.json(rows);
});

router.post('/add', async (req, res) => {
  const { Capacity, GSM_Number, Installation_Date, Assigned_Location, Vehicle_ID, Authority_ID } = req.body;
  const [result] = await db.execute(
    'INSERT INTO Bin (Capacity, GSM_Number, Installation_Date, Assigned_Location, Vehicle_ID, Authority_ID) VALUES (?, ?, ?, ?, ?, ?)',
    [Capacity, GSM_Number, Installation_Date, Assigned_Location, Vehicle_ID, Authority_ID]
  );
  res.json({ message: 'Bin added', id: result.insertId });
});

router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { Capacity, GSM_Number, Installation_Date, Assigned_Location, Vehicle_ID, Authority_ID } = req.body;
  await db.execute(
    'UPDATE Bin SET Capacity=?, GSM_Number=?, Installation_Date=?, Assigned_Location=?, Vehicle_ID=?, Authority_ID=? WHERE Bin_ID=?',
    [Capacity, GSM_Number, Installation_Date, Assigned_Location, Vehicle_ID, Authority_ID, id]
  );
  res.json({ message: 'Bin updated' });
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM Bin WHERE Bin_ID=?', [id]);
  res.json({ message: 'Bin deleted' });
});

export default router;
