const sequelize = require('../config/database');
const Notification = require('../models/Notification');

/**
 * Scans user subscriptions and ads to generate necessary notifications.
 * This is designed to be called when a user visits their dashboard/notifications.
 */
exports.syncSubscriptionNotifications = async (userId) => {
  try {
    const [[user]] = await sequelize.query(
      `SELECT subscription_plan, basic_plan_expires_at, star_plan_expires_at, premium_plan_expires_at, 
              (SELECT COUNT(*)::INT FROM deals WHERE "userId" = $1 AND status = 'active' AND active_until > NOW()) as active_ads
       FROM users WHERE id = $1`,
      { bind: [userId] }
    );

    if (!user) return;

    const now = new Date();
    const notificationsToCreate = [];

    // 1. Check Plan Expiries (72h, 48h, 24h)
    const plans = [
      { type: 'basic', label: 'Featured Boost', expiry: user.basic_plan_expires_at },
      { type: 'star', label: 'Star Premium', expiry: user.star_plan_expires_at },
      { type: 'premium', label: 'Ultimate Tier', expiry: user.premium_plan_expires_at }
    ];

    for (const plan of plans) {
      if (!plan.expiry) continue;
      const expiryDate = new Date(plan.expiry);
      const diffHrs = (expiryDate - now) / (1000 * 60 * 60);

      if (diffHrs > 0 && diffHrs <= 72) {
        let threshold = 0;
        if (diffHrs <= 24) threshold = 24;
        else if (diffHrs <= 48) threshold = 48;
        else threshold = 72;

        const title = `${plan.label} Expiring Soon`;
        const message = `Your ${plan.label} plan will expire in less than ${threshold} hours. Renew now to keep your boosted visibility!`;
        
        // Use a unique type to prevent spamming the same threshold
        const uniqueType = `EXPIRY_${plan.type.toUpperCase()}_${threshold}`;
        notificationsToCreate.push({ user_id: userId, type: uniqueType, title, message, link: '/pricing' });
      }
    }

    // 2. Check Ad Lifecycle (Product Inactive)
    const [expiredAds] = await sequelize.query(
      `SELECT id, title FROM deals WHERE "userId" = $1 AND status = 'active' AND active_until <= NOW() AND active_until > (NOW() - INTERVAL '3 days')`,
      { bind: [userId] }
    );
    if (expiredAds.length > 0) {
      const title = `${expiredAds.length} Ad(s) Recently Expired`;
      const message = `Some of your listings have reached their 30-day lifecycle and are no longer visible. Check your 'My Ads' to renew them.`;
      notificationsToCreate.push({ user_id: userId, type: 'ADS_EXPIRED_BATCH', title, message, link: '/vendor-dashboard/my-ads' });
    }

    // 3. Check Slot Capacity (9/10 etc)
    const limits = { free: 1, basic: 10, star: 20 }; // simplified
    // We fetch real stats from user profile if needed, but for now we'll do common checks
    if (user.subscription_plan === 'basic' && user.active_ads >= 9) {
        notificationsToCreate.push({ 
            user_id: userId, 
            type: 'CAPACITY_WARNING', 
            title: 'Featured Slots Almost Full', 
            message: 'You have used 9 or more of your 10 featured slots. Consider upgrading to the Star plan for more capacity!', 
            link: '/pricing' 
        });
    } else if (user.subscription_plan === 'free' && user.active_ads >= 1) {
        notificationsToCreate.push({ 
            user_id: userId, 
            type: 'CAPACITY_FREE_FULL', 
            title: 'Free Slot Limit Reached', 
            message: 'You have used your free listing slot. Upgrade to a paid plan to list more products and increase your sales!', 
            link: '/pricing' 
        });
    }

    // Insert unique notifications (avoid duplicates for same type if recently created)
    for (const n of notificationsToCreate) {
      const exists = await Notification.findOne({ 
        where: { 
          user_id: userId, 
          type: n.type,
          createdAt: { [sequelize.Sequelize.Op.gt]: new Date(now - 24 * 60 * 60 * 1000) } // Only notify once per 24h for a type
        } 
      });
      if (!exists) {
        await Notification.create(n);
      }
    }

  } catch (err) {
    console.error('[SubscriptionMonitor] Error:', err);
  }
};
