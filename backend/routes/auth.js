import express from 'express';
import bcrypt from 'bcryptjs';
import { executeQuery } from '../db.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { signAccessToken } from '../middleware/auth.js';
import { httpError } from '../utils/httpError.js';

const router = express.Router();

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { userId, password } = req.body || {};
    if (!userId || !password) {
      throw httpError(400, 'VALIDATION_ERROR', 'userId and password are required');
    }

    const [rows] = await executeQuery(
      `SELECT User_ID AS userId, Mobile_Number AS mobileNumber
       FROM UserTable WHERE User_ID = ?`,
      [userId]
    );

    if (!rows.length) {
      throw httpError(401, 'AUTH_FAILED', 'Invalid credentials');
    }

    // Temporary password strategy for legacy UserTable.
    const expectedHash =
      process.env.DEFAULT_PASSWORD_HASH || bcrypt.hashSync(String(rows[0].mobileNumber || ''), 8);
    const valid = bcrypt.compareSync(password, expectedHash);
    if (!valid) {
      throw httpError(401, 'AUTH_FAILED', 'Invalid credentials');
    }

    const token = signAccessToken({
      userId: rows[0].userId
    });
    res.json({ accessToken: token, tokenType: 'Bearer' });
  })
);

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { userId } = req.body || {};
    if (!userId) {
      throw httpError(400, 'VALIDATION_ERROR', 'userId is required');
    }
    const accessToken = signAccessToken({ userId });
    res.json({ accessToken, tokenType: 'Bearer' });
  })
);

export default router;
