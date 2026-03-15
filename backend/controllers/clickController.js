const jwt = require('jsonwebtoken');
const ClickEvent = require('../models/ClickEvent');

function getUserIdFromHeader(req) {
  const auth = req.headers.authorization || '';
  const [scheme, token] = auth.split(' ');
  if (scheme === 'Bearer' && token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded && decoded.id;
    } catch (_) {}
  }
  return null;
}

exports.record = async (req, res, next) => {
  try {
    const dealId = Number(req.params.id);
    if (!dealId) {
      return res.status(400).json({ success: false, message: 'Invalid deal id' });
    }
    const userId = (req.user && req.user.id) || getUserIdFromHeader(req);
    await ClickEvent.create({ deal_id: dealId, user_id: userId || null });
    return res.status(201).json({ success: true, message: 'Click recorded' });
  } catch (err) {
    return next(err);
  }
};
