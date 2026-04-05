module.exports = function staffMiddleware(req, res, next) {
  const user = req.user || {};
  
  if (user.role === 'admin' || user.role === 'csr') {
    return next();
  }
  
  return res.status(403).json({ 
    success: false, 
    message: 'Administrative access required' 
  });
};
