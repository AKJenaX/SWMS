import { executeQuery } from '../db.js';

export function auditAction(action, entityName, idResolver = (req) => req.params.id || null) {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      try {
        await executeQuery(
          `INSERT INTO audit_logs
             (actor_id, actor_role, action, entity_name, entity_id, request_id, ip_address, metadata_json)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            req.user?.userId || null,
            req.user?.roles?.[0] || null,
            action,
            entityName,
            idResolver(req, body),
            req.context?.requestId || null,
            req.ip || null,
            JSON.stringify({
              method: req.method,
              path: req.originalUrl,
              body: req.body
            })
          ]
        );
      } catch (_error) {
        // Audit failures should not block business response.
      }
      return originalJson(body);
    };

    next();
  };
}
