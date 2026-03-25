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
    
    if (!decoded || !decoded.id) {
      console.error('[AUTH] Token decoded but no ID found:', decoded);
      return res.status(401).json({ success: false, message: 'Invalid token payload' });
    }

    // Check if user exists and is not suspended
    const user = await User.findByPk(decoded.id, { attributes: ['id', 'status'] });
    if (!user) {
      console.error(`[AUTH] User not found for ID: ${decoded.id}`);
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
    }

    req.user = { id: decoded.id, userId: decoded.id, email: decoded.email, role: decoded.role };
    return next();
  } catch (err) {
    console.error('[AUTH] JWT verification failed:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
