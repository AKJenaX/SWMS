import jwt from 'jsonwebtoken';
import { executeQuery } from '../db.js';

function isDevBypassEnabled() {
  return String(process.env.ALLOW_DEV_AUTH_BYPASS || '').toLowerCase() === 'true';
}

function getJwtSecret() {
  return process.env.JWT_SECRET || 'swms-dev-secret';
}

export function requireAuth(req, res, next) {
  if (isDevBypassEnabled()) {
    req.user = {
      userId: Number(process.env.DEV_BYPASS_USER_ID || 1),
      roles: ['super_admin']
    };
    return next();
  }

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.query.access_token || null;

  if (!token) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Missing bearer token' });
  }

  try {
    req.user = jwt.verify(token, getJwtSecret());
    return next();
  } catch (_error) {
    return res.status(401).json({ code: 'UNAUTHORIZED', message: 'Invalid token' });
  }
}

export function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      if (isDevBypassEnabled()) {
        req.user = req.user || { userId: Number(process.env.DEV_BYPASS_USER_ID || 1) };
        req.user.roles = ['super_admin'];
        return next();
      }

      if (!req.user?.userId) {
        return res.status(401).json({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      const [rows] = await executeQuery(
        `SELECT r.role_name
         FROM user_roles ur
         JOIN roles r ON r.id = ur.role_id
         WHERE ur.user_id = ?`,
        [req.user.userId]
      );
      const userRoles = rows.map((row) => row.role_name);
      if (!roles.some((role) => userRoles.includes(role))) {
        return res.status(403).json({ code: 'FORBIDDEN', message: 'Insufficient role' });
      }
      req.user.roles = userRoles;
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function requirePermission(...permissions) {
  return async (req, res, next) => {
    try {
      if (isDevBypassEnabled()) {
        return next();
      }

      if (!req.user?.userId) {
        return res.status(401).json({ code: 'UNAUTHORIZED', message: 'User not authenticated' });
      }

      const [rows] = await executeQuery(
        `SELECT p.permission_name
         FROM user_roles ur
         JOIN role_permissions rp ON rp.role_id = ur.role_id
         JOIN permissions p ON p.id = rp.permission_id
         WHERE ur.user_id = ?`,
        [req.user.userId]
      );
      const userPermissions = rows.map((row) => row.permission_name);
      if (!permissions.some((permission) => userPermissions.includes(permission))) {
        return res.status(403).json({ code: 'FORBIDDEN', message: 'Missing permission' });
      }
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function signAccessToken(payload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  });
}
