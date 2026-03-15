module.exports = function adminMiddleware(req, res, next) {
  const admins = (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean);
  const adminIds = (process.env.ADMIN_USER_IDS || '').split(',').map((s) => s.trim()).filter(Boolean).map((x) => Number(x)).filter((x) => !Number.isNaN(x));
  const user = req.user || {};
  if ((user.email && admins.includes(user.email)) || (user.id && adminIds.includes(Number(user.id)))) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Admin access required' });
}
