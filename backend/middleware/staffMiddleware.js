module.exports = function staffMiddleware(req, res, next) {
  const user = req.user || {};
  const role = String(user.role || '').toLowerCase();
  
  if (role === 'admin' || role === 'csr') {
    return next();
  }
  
  return res.status(403).json({ 
    success: false, 
    message: 'Staff access required' 
  });
};
