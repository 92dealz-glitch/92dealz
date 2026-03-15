const sequelize = require('../config/database');

exports.stats = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const [[adsRow]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS total_ads FROM deals WHERE "userId" = $1`,
      { bind: [userId] }
    );

    const [[soldRow]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS items_sold FROM deals WHERE "userId" = $1 AND status = 'sold'`,
      { bind: [userId] }
    );

    const [[viewsRow]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS total_views
       FROM click_events
       WHERE deal_id IN (SELECT id FROM deals WHERE "userId" = $1) AND type='view'`,
      { bind: [userId] }
    );

    const [[msgTotal]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS messages_total FROM messages WHERE to_user_id = $1`,
      { bind: [userId] }
    );
    const [[msgUnread]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS messages_unread FROM messages WHERE to_user_id = $1 AND read_at IS NULL`,
      { bind: [userId] }
    );

    return res.json({
      success: true,
      data: {
        total_ads: adsRow.total_ads || 0,
        total_views: viewsRow.total_views || 0,
        items_sold: soldRow.items_sold || 0,
        messages_total: msgTotal.messages_total || 0,
        messages_unread: msgUnread.messages_unread || 0,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.analyticsWeekly = async (req, res, next) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const [rows] = await sequelize.query(
      `WITH days AS (
         SELECT generate_series::date AS day
         FROM generate_series((CURRENT_DATE - INTERVAL '6 days')::date, CURRENT_DATE, INTERVAL '1 day')
       ),
       my_deals AS (SELECT id FROM deals WHERE "userId"=$1),
       visitors AS (
         SELECT date_trunc('day', clicked_at)::date AS day, COUNT(*)::INT AS c
         FROM click_events WHERE type='view' AND deal_id IN (SELECT id FROM my_deals)
         GROUP BY 1
       ),
       contacts AS (
         SELECT date_trunc('day', clicked_at)::date AS day, COUNT(*)::INT AS c
         FROM click_events WHERE type='contact' AND deal_id IN (SELECT id FROM my_deals)
         GROUP BY 1
       ),
       chats AS (
         SELECT date_trunc('day', "createdAt")::date AS day, COUNT(*)::INT AS c
         FROM messages WHERE (to_user_id=$1 OR from_user_id=$1)
         GROUP BY 1
       )
       SELECT d.day,
              COALESCE(v.c,0) AS visitors,
              COALESCE(ct.c,0) AS contact_views,
              COALESCE(ch.c,0) AS chats
       FROM days d
       LEFT JOIN visitors v ON v.day = d.day
       LEFT JOIN contacts ct ON ct.day = d.day
       LEFT JOIN chats ch ON ch.day = d.day
       ORDER BY d.day ASC`,
      { bind: [userId] }
    );
    return res.json({ success: true, data: rows });
  } catch (err) { return next(err); }
};
