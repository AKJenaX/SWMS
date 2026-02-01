import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';

import authorityRoutes from './authority.js';
import vehicleRoutes from './vehicle.js';
import driverRoutes from './driver.js';
import userRoutes from './usertable.js';
import binRoutes from './bin.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/authority', authorityRoutes);
app.use('/vehicle', vehicleRoutes);
app.use('/driver', driverRoutes);
app.use('/user', userRoutes);
app.use('/bin', binRoutes);

const PORT = 3000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
