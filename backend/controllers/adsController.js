const sequelize = require('../config/database');
const dealsQuery = require('./dealsQueryController');

exports.listActive = async (req, res, next) => {
  try {
    req.query = { ...req.query, status: 'active' };
    return dealsQuery.list(req, res, next);
  } catch (err) {
    return next(err);
  }
};

exports.listMine = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const [rows] = await sequelize.query(
      `SELECT d.id, d.title, d.description, d.price, d."createdAt", d.image_url, d.status,
              (SELECT COUNT(*)::INT FROM click_events ce WHERE ce.deal_id = d.id AND ce.type = 'view') as views
       FROM deals d
       WHERE d."userId" = $1
       ORDER BY d."createdAt" DESC`,
      { bind: [userId] }
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    return dealsQuery.create(req, res, next);
  } catch (err) {
    return next(err);
  }
};

exports.update = async (req, res, next) => dealsQuery.update(req, res, next);
exports.remove = async (req, res, next) => dealsQuery.remove(req, res, next);
exports.getById = async (req, res, next) => dealsQuery.getById(req, res, next);

exports.markSold = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const [rows] = await sequelize.query(
      `UPDATE deals SET status = 'sold', "updatedAt" = NOW() WHERE id = $1 AND "userId" = $2 RETURNING id`,
      { bind: [id, userId] }
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Ad not found or not owned by user' });
    return res.json({ success: true, data: { id: rows[0].id } });
  } catch (err) {
    return next(err);
  }
};
