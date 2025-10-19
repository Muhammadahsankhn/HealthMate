const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Try verifying with the configured JWT secret first.
    const configuredSecret = process.env.JWT_SECRET;
    const devFallback = 'dev_jwt_secret_fallback';

    const tryVerify = (s) => {
      try {
        return jwt.verify(token, s);
      } catch (e) {
        return null;
      }
    };

    let decoded = null;
    if (configuredSecret) {
      decoded = tryVerify(configuredSecret);
    }

    // If verification failed with configured secret, and we're in development, try the dev fallback
    if (!decoded && process.env.NODE_ENV !== 'production') {
      decoded = tryVerify(devFallback);
      if (decoded) console.warn('authMiddleware: token verified with dev fallback secret');
    }

    if (!decoded) {
      console.warn('authMiddleware: token verification failed', (process.env.NODE_ENV !== 'production') ? 'see secrets or token' : 'hidden');
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded; // contains userId and email if encoded that way
    next();
  } catch (err) {
    console.warn('authMiddleware: unexpected error during token verification', err && err.message ? err.message : err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
