const sequelize = require('../config/database');
const Visitor = require('../models/Visitor');

exports.logView = async (req, res, next) => {
  try {
    const { deal_id } = req.body;
    if (!deal_id) return res.status(400).json({ success: false, message: 'deal_id required' });
    const userId = req.user ? req.user.id : null;
    await sequelize.query(
      `INSERT INTO click_events (deal_id, user_id, type, clicked_at) VALUES ($1, $2, 'view', NOW())`,
      { bind: [Number(deal_id), userId] }
    );
    return res.status(201).json({ success: true });
  } catch (err) { return next(err); }
};

exports.logContact = async (req, res, next) => {
  try {
    const { deal_id } = req.body;
    if (!deal_id) return res.status(400).json({ success: false, message: 'deal_id required' });
    const userId = req.user ? req.user.id : null;
    await sequelize.query(
      `INSERT INTO click_events (deal_id, user_id, type, clicked_at) VALUES ($1, $2, 'contact', NOW())`,
      { bind: [Number(deal_id), userId] }
    );
    // Update the deal itself to mark it as interacted
    await sequelize.query(
      `UPDATE deals SET is_contacted = true WHERE id = $1`,
      { bind: [Number(deal_id)] }
    );
    return res.status(201).json({ success: true });
  } catch (err) { return next(err); }
};

exports.logVisit = async (req, res, next) => {
  try {
    const { visitor_id } = req.body;
    if (!visitor_id) return res.status(400).json({ success: false, message: 'visitor_id required' });
    
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.get('User-Agent');

    const [visitor, created] = await Visitor.findOrCreate({
      where: { visitor_id },
      defaults: { ip_address: ip, user_agent: ua }
    });

    if (!created) {
      visitor.last_visited_at = new Date();
      if (ip) visitor.ip_address = ip;
      if (ua) visitor.user_agent = ua;
      await visitor.save();
    }

    return res.json({ success: true });
  } catch (err) { return next(err); }
};

// Admin analytics endpoints (used by adminRoutes)
exports.summary = async (_req, res, next) => {
  try {
    const [[deals]] = await sequelize.query(`SELECT COUNT(*)::INT AS total_deals FROM deals`);
    const [[published]] = await sequelize.query(`SELECT COUNT(*)::INT AS published FROM deals WHERE status::TEXT='active'`);
    const [[drafts]] = await sequelize.query(`SELECT COUNT(*)::INT AS drafts FROM deals WHERE status::TEXT='draft'`);
    const [[scheduled]] = await sequelize.query(`SELECT COUNT(*)::INT AS scheduled FROM deals WHERE status::TEXT='scheduled'`);
    const [[views]] = await sequelize.query(`SELECT COUNT(*)::INT AS total_views FROM click_events WHERE type='view'`);
    const [[contacts]] = await sequelize.query(`SELECT COUNT(*)::INT AS total_contacts FROM click_events WHERE type='contact'`);
    const [[visitors]] = await sequelize.query(`SELECT COUNT(*)::INT AS total_visitors FROM visitors`);
    
    // Get deals by category
    const [categories] = await sequelize.query(
      `SELECT c.name, COUNT(d.id)::INT AS value
       FROM categories c
       LEFT JOIN deals d ON d.category_id = c.id
       GROUP BY c.id
       ORDER BY value DESC
       LIMIT 7`
    );

    // Get recent deals
    const [recentDeals] = await sequelize.query(
      `SELECT d.id, d.title, d.status, d.price, d."updatedAt", u.name as merchant,
              (SELECT COUNT(*)::INT FROM click_events ce WHERE ce.deal_id = d.id AND ce.type='view') as views
       FROM deals d
       LEFT JOIN users u ON u.id = d."userId"
       ORDER BY d."createdAt" DESC
       LIMIT 5`
    );

    // Get poll analytics with default options for Question 1 (Category)
    const [q1Results] = await sequelize.query(
      `SELECT poll_category as name, COUNT(*)::INT as value 
       FROM users 
       WHERE poll_category IS NOT NULL 
       GROUP BY poll_category`
    );

    const q1Defaults = [
      { name: 'Electronics', value: 0 },
      { name: 'Fashion', value: 0 },
      { name: 'Phones', value: 0 }
    ];

    const pollQ1Analytics = q1Defaults.map(opt => {
      const match = q1Results.find(r => r.name === opt.name);
      return match ? match : opt;
    });

    // Get poll analytics with default options for Question 2 (Feature)
    const [q2Results] = await sequelize.query(
      `SELECT poll_choice as name, COUNT(*)::INT as value 
       FROM users 
       WHERE poll_choice IS NOT NULL 
       GROUP BY poll_choice`
    );

    const q2Defaults = [
      { name: 'Fine pictures', value: 0 },
      { name: 'Popular items', value: 0 },
      { name: 'Good descriptions', value: 0 }
    ];

    const pollQ2Analytics = q2Defaults.map(opt => {
      const match = q2Results.find(r => r.name === opt.name);
      return match ? match : opt;
    });

    return res.json({ 
      success: true, 
      data: { 
        total_deals: deals?.total_deals || 0, 
        published: published?.published || 0,
        drafts: drafts?.drafts || 0,
        scheduled: scheduled?.scheduled || 0,
        total_views: views?.total_views || 0, 
        total_contacts: contacts?.total_contacts || 0,
        total_visitors: visitors?.total_visitors || 0,
        categories: categories || [],
        recentDeals: recentDeals || [],
        pollQ1: pollQ1Analytics,
        pollQ2: pollQ2Analytics
      } 
    });
  } catch (err) { return next(err); }
};

exports.topDeals = async (_req, res, next) => {
  try {
    const [rows] = await sequelize.query(
      `SELECT d.id, d.title, d.price, d.image_url, COUNT(c.id)::INT AS views
       FROM deals d
       LEFT JOIN click_events c ON c.deal_id = d.id AND c.type='view'
       GROUP BY d.id
       ORDER BY views DESC
       LIMIT 10`
    );
    return res.json({ success: true, data: rows });
  } catch (err) { return next(err); }
};

exports.clicksByDay = async (_req, res, next) => {
  try {
    const [rows] = await sequelize.query(
      `SELECT date_trunc('day', clicked_at)::date AS day,
              SUM(CASE WHEN type='view' THEN 1 ELSE 0 END)::INT AS views,
              SUM(CASE WHEN type='contact' THEN 1 ELSE 0 END)::INT AS contacts
       FROM click_events
       GROUP BY 1
       ORDER BY day DESC
       LIMIT 30`
    );
    return res.json({ success: true, data: rows });
  } catch (err) { return next(err); }
};
