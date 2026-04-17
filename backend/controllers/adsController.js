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
    
    let status = req.query.status;
    const bind = [userId];
    let statusFilter = '';
    
    if (status) {
      if (status === 'closed') status = 'sold'; // Handle frontend 'closed' to backend 'sold' mapping
      statusFilter = `AND d.status = $2`;
      if (status === 'active') {
        statusFilter += ` AND d.active_until > NOW()`;
      }
      bind.push(status);
    }

    const [rows] = await sequelize.query(
      `SELECT d.id, d.title, d.description, d.price, d."createdAt", d.image_url, d.status, d.plan_type, d.is_contacted, d.is_locked, d.active_until,
              (SELECT COUNT(*)::INT FROM click_events ce WHERE ce.deal_id = d.id AND ce.type = 'view') as views
       FROM deals d
       WHERE d."userId" = $1 ${statusFilter}
       ORDER BY d."createdAt" DESC`,
      { bind }
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
exports.trending = async (req, res, next) => dealsQuery.trending(req, res, next);
exports.featured = async (req, res, next) => dealsQuery.featured(req, res, next);
exports.hotDeals = async (req, res, next) => dealsQuery.hotDeals(req, res, next);

exports.markSold = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user && req.user.id;
    const isAdmin = req.user && req.user.role === 'admin';
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    let sql, params;
    if (isAdmin) {
      sql = `UPDATE deals SET status = 'sold', "updatedAt" = NOW() WHERE id = $1 RETURNING id`;
      params = [id];
    } else {
      sql = `UPDATE deals SET status = 'sold', "updatedAt" = NOW() WHERE id = $1 AND "userId" = $2 RETURNING id`;
      params = [id, userId];
    }
    const [rows] = await sequelize.query(sql, { bind: params });
    if (!rows.length) return res.status(404).json({ success: false, message: 'Ad not found or not owned by user' });
    return res.json({ success: true, data: { id: rows[0].id } });
  } catch (err) {
    return next(err);
  }
};

exports.getLocationCounts = async (req, res, next) => {
  try {
    // Get country/location counts
    const [locations] = await sequelize.query(`
      SELECT COALESCE(location, 'Nigeria') as name, COUNT(*)::INT as count 
      FROM deals 
      WHERE status = 'active' 
      GROUP BY location
    `);
    
    // Get state counts
    const [states] = await sequelize.query(`
      SELECT state as name, COUNT(*)::INT as count 
      FROM deals 
      WHERE status = 'active' AND state IS NOT NULL AND state != ''
      GROUP BY state
    `);
    
    // Get city counts
    const [cities] = await sequelize.query(`
      SELECT city as name, state, COUNT(*)::INT as count 
      FROM deals 
      WHERE status = 'active' AND city IS NOT NULL AND city != ''
      GROUP BY state, city
    `);

    return res.json({
      success: true,
      data: {
        locations,
        states,
        cities
      }
    });
  } catch (err) {
    return next(err);
  }
};

exports.updateVisibility = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { plan_type } = req.body;
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!['free', 'basic', 'star'].includes(plan_type)) {
      return res.status(400).json({ success: false, message: 'Invalid plan type' });
    }

    // 1. Check if ad is locked (already has interactions/sold)
    const [[adCheck]] = await sequelize.query(
      `SELECT is_locked, is_contacted, status, plan_type FROM deals WHERE id = $1 AND "userId" = $2`,
      { bind: [id, userId] }
    );
    if (!adCheck) return res.status(404).json({ success: false, message: 'Ad not found or not owned by user' });
    
    // Strict block for "Logged" products
    if (adCheck.is_locked || adCheck.is_contacted || adCheck.status === 'sold') {
       return res.status(403).json({ 
         success: false, 
         message: 'This ad is logged because it has generated leads or is sold. Its visibility tier cannot be changed to ensure consistency for interested buyers.' 
       });
    }

    // prevent "downgrade" to free if it's already on a higher tier? The user said "can only upgrade or degrade that hasn't been logged yet".
    // This implies if NOT logged, they can change.

    // 2. Check user plan specific expiries
    const [[user]] = await sequelize.query(
      `SELECT basic_plan_expires_at, star_plan_expires_at FROM users WHERE id = $1`, 
      { bind: [userId] }
    );
    const now = new Date();

    if (plan_type === 'star') {
      const isExpired = !user.star_plan_expires_at || new Date(user.star_plan_expires_at) < now;
      if (isExpired) {
        return res.status(403).json({ success: false, message: 'Your Premium (Star) subscription has expired. Please renew to use this tier.' });
      }
    } else if (plan_type === 'basic') {
      const isExpired = !user.basic_plan_expires_at || new Date(user.basic_plan_expires_at) < now;
      if (isExpired) {
        return res.status(403).json({ success: false, message: 'Your Featured (Basic) subscription has expired. Please renew to use this tier.' });
      }
    }

    // 2. Check quota
    const limits = { free: 1, basic: 10, star: 20 };
    const [[countRow]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS count FROM deals WHERE "userId" = $1 AND plan_type = $2 AND "createdAt" >= date_trunc('month', CURRENT_DATE)`,
      { bind: [userId, plan_type] }
    );
    if (countRow.count >= limits[plan_type]) {
      return res.status(403).json({ success: false, message: `You have exhausted your monthly ${plan_type} ad slots (${limits[plan_type]}).` });
    }

    // 3. Update
    const [rows] = await sequelize.query(
      `UPDATE deals SET plan_type = $1, "updatedAt" = NOW() WHERE id = $2 AND "userId" = $3 RETURNING id`,
      { bind: [plan_type, id, userId] }
    );

    if (!rows.length) return res.status(404).json({ success: false, message: 'Ad not found or not owned by user' });
    return res.json({ success: true, data: { id: rows[0].id, plan_type } });
  } catch (err) {
    return next(err);
  }
};
