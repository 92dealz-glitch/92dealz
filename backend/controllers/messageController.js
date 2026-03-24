const sequelize = require('../config/database');

exports.send = async (req, res, next) => {
  try {
    const fromId = req.user && req.user.id;
    if (!fromId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { to_user_id, deal_id, content } = req.body;
    if (!to_user_id || !content) return res.status(400).json({ success: false, message: 'to_user_id and content are required' });
    const [rows] = await sequelize.query(
      `INSERT INTO messages (from_user_id, to_user_id, deal_id, content, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id`,
      { bind: [fromId, Number(to_user_id), deal_id ? Number(deal_id) : null, String(content)] }
    );
    return res.status(201).json({ success: true, data: { id: rows[0].id } });
  } catch (err) { return next(err); }
};

exports.threads = async (req, res, next) => {
  try {
    const me = req.user && req.user.id;
    if (!me) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const [rows] = await sequelize.query(
      `WITH msgs AS (
         SELECT *, CASE WHEN from_user_id=$1 THEN to_user_id ELSE from_user_id END AS other_id
         FROM messages
         WHERE from_user_id=$1 OR to_user_id=$1
       ),
       last_msg AS (
         SELECT DISTINCT ON (other_id) other_id, id, content, "createdAt", deal_id
         FROM msgs ORDER BY other_id, "createdAt" DESC
       ),
       unread AS (
         SELECT other_id, COUNT(*)::INT AS unread_count
         FROM msgs WHERE to_user_id=$1 AND read_at IS NULL GROUP BY other_id
       )
       SELECT 
         l.other_id, 
         l.id AS last_id, 
         l.content AS last_content, 
         l."createdAt" AS last_created_at, 
         COALESCE(u.unread_count,0) AS unread_count, 
         l.deal_id,
         ou.name AS other_name,
         d.title AS deal_title
       FROM last_msg l
       LEFT JOIN unread u ON u.other_id = l.other_id
       LEFT JOIN users ou ON ou.id = l.other_id
       LEFT JOIN deals d ON d.id = l.deal_id
       ORDER BY l."createdAt" DESC`,
      { bind: [me] }
    );
    return res.json({ success: true, data: rows });
  } catch (err) { return next(err); }
};

exports.threadDetail = async (req, res, next) => {
  try {
    const me = req.user && req.user.id;
    if (!me) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const otherId = Number(req.query.userId);
    const dealId = req.query.dealId ? Number(req.query.dealId) : null;
    if (!otherId) return res.status(400).json({ success: false, message: 'userId is required' });
    const binds = [me, otherId, otherId, me];
    let dealFilter = '';
    if (dealId) { dealFilter = ' AND deal_id = $5 '; binds.push(dealId); }
    const [rows] = await sequelize.query(
      `SELECT id, from_user_id, to_user_id, deal_id, content, "createdAt", read_at
       FROM messages
       WHERE ((from_user_id=$1 AND to_user_id=$2) OR (from_user_id=$3 AND to_user_id=$4)) ${dealFilter}
       ORDER BY "createdAt" ASC`,
      { bind: binds }
    );
    // mark unread as read
    await sequelize.query(
      `UPDATE messages SET read_at = NOW()
       WHERE to_user_id=$1 AND from_user_id=$2 AND read_at IS NULL`,
      { bind: [me, otherId] }
    );
    return res.json({ success: true, data: rows });
  } catch (err) { return next(err); }
};

