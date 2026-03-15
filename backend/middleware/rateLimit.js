function createRateLimiter({ windowMs, max }) {
  const buckets = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip}:${req.path}`;
    const bucket = buckets.get(key) || [];
    const fresh = bucket.filter((t) => now - t < windowMs);
    fresh.push(now);
    buckets.set(key, fresh);
    if (fresh.length > max) {
      return res.status(429).json({ success: false, message: 'Too many requests' });
    }
    return next();
  };
}

module.exports = { createRateLimiter };
