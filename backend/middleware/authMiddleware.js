/**
 * JWT authentication middleware
 * - Expects Authorization: Bearer <token>
 * - Verifies token and attaches payload to req.user
 */
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ success: false, message: 'Authorization token missing' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is suspended
    const user = await User.findByPk(decoded.id, { attributes: ['id', 'status'] });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
    }

    req.user = { id: decoded.id, userId: decoded.id, email: decoded.email, role: decoded.role };
    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
