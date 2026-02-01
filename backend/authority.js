import express from 'express';
import { db } from './db.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM Authority');
  res.json(rows);
});

router.post('/add', async (req, res) => {
  const { Name, Designation, Control_Room, Works_Under } = req.body;
  const [result] = await db.execute(
    'INSERT INTO Authority (Name, Designation, Control_Room, Works_Under) VALUES (?, ?, ?, ?)',
    [Name, Designation, Control_Room, Works_Under || null]
  );
  res.json({ message: 'Authority added', id: result.insertId });
});

router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { Name, Designation, Control_Room, Works_Under } = req.body;
  await db.execute(
    'UPDATE Authority SET Name=?, Designation=?, Control_Room=?, Works_Under=? WHERE Authority_ID=?',
    [Name, Designation, Control_Room, Works_Under || null, id]
  );
  res.json({ message: 'Authority updated' });
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  await db.execute('DELETE FROM Authority WHERE Authority_ID=?', [id]);
  res.json({ message: 'Authority deleted' });
});

export default router;
