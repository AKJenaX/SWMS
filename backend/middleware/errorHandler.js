export function notFoundHandler(req, res) {
  return res.status(404).json({
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    requestId: req.context?.requestId || null
  });
}

export function errorHandler(err, req, res, _next) {
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.publicMessage || err.message || 'Unexpected error';

  return res.status(status).json({
    code,
    message,
    details: err.details || null,
    requestId: req.context?.requestId || null
  });
}
