const sequelize = require('../config/database');
const User = require('../models/userModel');
const Notification = require('../models/Notification');

async function findMatchingAlerts(deal) {
  const bind = [];
  const where = [];
  if (deal.title) {
    bind.push(`%${deal.title}%`, `%${deal.title}%`);
    where.push(`(keyword ILIKE $${bind.length - 1} OR keyword ILIKE $${bind.length})`);
  }
  if (deal.category_id) {
    bind.push(deal.category_id);
    where.push(`(category_id IS NULL OR category_id = $${bind.length})`);
  } else {
    where.push(`(category_id IS NULL)`);
  }
  const sql = `SELECT user_id FROM alerts WHERE ${where.join(' AND ')}`;
  const [rows] = await sequelize.query(sql, { bind });
  return rows.map(r => r.user_id);
}

async function notifyAlertsForDeal(deal, sendMail) {
  if (!deal || !deal.title) return;
  const userIds = await findMatchingAlerts(deal);
  if (!userIds.length) return;
  const users = await User.findAll({ where: { id: userIds } });
  const emails = users.map(u => u.email).filter(Boolean);
  if (!emails.length) return;
  const subject = `New deal: ${deal.title}`;
  const text = `A new deal may match your alert: ${deal.title}\nPrice: ${deal.price}\n` +
               `Visit the app to view details.`;
  for (const user of users) {
    try {
      if (user.email) {
        await sendMail(user.email, subject, text);
      }
      // NEW: Create in-app notification
      await Notification.create({
        user_id: user.id,
        type: 'DEAL_ALERT',
        title: `New Deal Alert: ${deal.title}`,
        message: `A new deal matches your alert: ${deal.title}. Price: ${deal.price}`,
        link: `/product/${deal.id}`
      });
    } catch (_) {}
  }
}

module.exports = { notifyAlertsForDeal };
