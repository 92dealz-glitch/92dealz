module.exports = function adminMiddleware(req, res, next) {
  const user = req.user || {};
  if (user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Admin access required' });
}
