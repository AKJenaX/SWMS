const enabled = (value) => String(value || '').toLowerCase() === 'true';

export function requireFeature(flagName) {
  return (req, res, next) => {
    if (enabled(process.env[flagName])) {
      return next();
    }

    return res.status(503).json({
      code: 'FEATURE_DISABLED',
      message: `${flagName} is disabled`,
      requestId: req.context?.requestId || null
    });
  };
}
