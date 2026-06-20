/**
 * User controller
 * - Implements REST actions using Sequelize models
 * - All handlers are async and forward errors to centralized error middleware
 */
const sequelize = require('../config/database');
const User = require('../models/userModel');
const formatPhone = require('../utils/formatPhone');
const { getCountryFromRequest, getCountryFromPhone } = require('../utils/locationUtils');

// POST /api/users/create
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const formattedPhone = formatPhone(phone);
    const user = await User.create({ name, email, phone: formattedPhone || null, password });
    return res.status(201).json({ success: true, data: user });
  } catch (err) {
    return next(err);
  }
};

// GET /api/users
exports.getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const where = {};
    if (role) where.role = role;

    const users = await User.findAll({ 
      where,
      attributes: ['id', 'name', 'email', 'phone', 'role', 'profile_image_url', 'createdAt', 'businessName', 'businessCategory', 'businessAddress', 'rating', 'responseTime', 'about', 'is_verified', 'is_phone_verified', 'is_email_verified', 'country_code', 'country_name', 'subscription_plan'],
      order: [['id', 'ASC']] 
    });

    // For each user, get their ad count
    const data = await Promise.all(users.map(async (u) => {
      const [[adsRow]] = await sequelize.query(
        `SELECT COUNT(*)::INT AS total_ads FROM deals WHERE "userId" = $1 AND status = 'active'`,
        { bind: [u.id] }
      );
      return {
        ...u.toJSON(),
        total_ads: adsRow.total_ads || 0,
        status: "Online", // Mock status
        perf: "On track", // Mock performance
      };
    }));

    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

// GET /api/users/:id
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'phone', 'profile_image_url', 'createdAt', 'businessName', 'businessCategory', 'businessAddress', 'rating', 'responseTime', 'about', 'is_verified', 'country_code', 'country_name', 'subscription_plan'],
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Self-healing: if country is missing, try to detect it
    if (!user.country_code) {
      let detected = { code: null, name: null };
      if (user.phone) detected = getCountryFromPhone(user.phone);
      if (!detected.code) detected = getCountryFromRequest(req);
      
      if (detected.code) {
        user.country_code = detected.code;
        user.country_name = detected.name;
        await user.save();
      }
    }

    // Get total ads count
    const [[adsRow]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS total_ads FROM deals WHERE "userId" = $1 AND status = 'active'`,
      { bind: [id] }
    );

    const data = {
      ...user.toJSON(),
      total_ads: adsRow.total_ads || 0,
    };

    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.destroy();
    return res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    return next(err);
  }
};

// GET /api/user/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'phone', 'profile_image_url', 'createdAt', 'updatedAt', 'role', 'businessName', 'businessCategory', 'businessAddress', 'rating', 'responseTime', 'is_verified', 'is_phone_verified', 'is_email_verified', 'verification_status', 'government_id_url', 'last_poll_date', 'poll_category', 'poll_choice', 'about', 'status', 'country_code', 'country_name', 'subscription_plan', 'basic_plan_expires_at', 'star_plan_expires_at', 'premium_plan_expires_at', 'extra_slots_purchased'],
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Self-healing: if country is missing, try to detect it
    if (!user.country_code) {
      let detected = { code: null, name: null };
      if (user.phone) detected = getCountryFromPhone(user.phone);
      if (!detected.code) detected = getCountryFromRequest(req);
      
      if (detected.code) {
        user.country_code = detected.code;
        user.country_name = detected.name;
        await user.save();
      }
    }

    // --- Dynamic Plan Calculation & Sync ---
    const now = new Date();
    let calculatedPlan = 'free';
    if (user.premium_plan_expires_at && new Date(user.premium_plan_expires_at) > now) {
      calculatedPlan = 'premium';
    } else if (user.star_plan_expires_at && new Date(user.star_plan_expires_at) > now) {
      calculatedPlan = 'star';
    } else if (user.basic_plan_expires_at && new Date(user.basic_plan_expires_at) > now) {
      calculatedPlan = 'basic';
    }

    const previousPlan = user.subscription_plan;
    if (user.subscription_plan !== calculatedPlan) {
      user.subscription_plan = calculatedPlan;
      await user.save();

      // If they just dropped from a paid plan to 'free', deactivate all their active ads
      if (['basic', 'star', 'premium'].includes(previousPlan) && calculatedPlan === 'free') {
        await sequelize.query(
          `UPDATE deals SET status = 'inactive' WHERE "userId" = $1 AND status = 'active'`,
          { bind: [user.id] }
        );
      }
    }

    // Add subscription stats
    const [[totalAdsRow]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS count FROM deals WHERE "userId" = $1 AND "createdAt" >= date_trunc('month', CURRENT_DATE)`,
      { bind: [req.user.id] }
    );
    const [[starAdsRow]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS count FROM deals WHERE "userId" = $1 AND plan_type = 'star' AND "createdAt" >= date_trunc('month', CURRENT_DATE)`,
      { bind: [req.user.id] }
    );
    const [[freeAdsRow]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS count FROM deals WHERE "userId" = $1 AND plan_type = 'free' AND "createdAt" >= date_trunc('month', CURRENT_DATE)`,
      { bind: [req.user.id] }
    );
    const [[basicAdsRow]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS count FROM deals WHERE "userId" = $1 AND plan_type = 'basic' AND "createdAt" >= date_trunc('month', CURRENT_DATE)`,
      { bind: [req.user.id] }
    );

    const [[premiumAdsRow]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS count FROM deals WHERE "userId" = $1 AND plan_type = 'premium' AND "createdAt" >= date_trunc('month', CURRENT_DATE)`,
      { bind: [req.user.id] }
    );
    
    // Active vs Inactive total counts
    const [[activeRow]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS count FROM deals WHERE "userId" = $1 AND status = 'active'`,
      { bind: [req.user.id] }
    );
    const [[inactiveRow]] = await sequelize.query(
      `SELECT COUNT(*)::INT AS count FROM deals WHERE "userId" = $1 AND status != 'active'`,
      { bind: [req.user.id] }
    );

    const subscription_stats = {
      total: totalAdsRow.count,
      free: freeAdsRow.count,
      star: starAdsRow.count,
      basic: basicAdsRow.count,
      premium: premiumAdsRow.count,
      active_count: activeRow.count,
      inactive_count: inactiveRow.count,
      limits: {
        free: 1 + (user.extra_slots_purchased || 0),
        basic: 10,
        star: 20,
        premium: 1000000
      }
    };

    return res.json({ success: true, data: { ...user.toJSON(), subscription_plan: calculatedPlan, subscription_stats } });
  } catch (err) {
    return next(err);
  }
};

// PUT /api/user/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, email, profile_image_url, businessName, businessCategory, businessAddress, about } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Role check for locking
    const isVendor = user.role === 'vendor';

    if (typeof name === 'string') user.name = name;
    
    // Lock verified phone for vendors
    if (typeof phone === 'string' || phone === null) {
      if (isVendor && user.is_phone_verified && phone !== user.phone && phone !== null) {
        // Skip updating phone if verified and different
        console.log(`[ProfileLock] Blocked phone update for verified vendor ${user.id}`);
      } else {
        user.phone = formatPhone(phone) || null;
      }
    }

    // Lock verified email for vendors (if provided in body)
    if (typeof email === 'string') {
      if (isVendor && user.is_email_verified && email !== user.email) {
        // Skip updating email if verified and different
        console.log(`[ProfileLock] Blocked email update for verified vendor ${user.id}`);
      } else {
        user.email = email.trim().toLowerCase();
      }
    }

    if (typeof profile_image_url === 'string' || profile_image_url === null) user.profile_image_url = profile_image_url || null;
    
    if (typeof businessName === 'string' || businessName === null) user.businessName = businessName || null;
    if (typeof businessCategory === 'string' || businessCategory === null) user.businessCategory = businessCategory || null;
    if (typeof businessAddress === 'string' || businessAddress === null) user.businessAddress = businessAddress || null;
    if (typeof about === 'string' || about === null) user.about = about || null;
    
    await user.save();
    return res.json({
      success: true,
      data: { 
        id: user.id, name: user.name, email: user.email, phone: user.phone, profile_image_url: user.profile_image_url,
        businessName: user.businessName, businessCategory: user.businessCategory, businessAddress: user.businessAddress, about: user.about,
        is_verified: user.is_verified,
        is_phone_verified: user.is_phone_verified,
        is_email_verified: user.is_email_verified,
        country_code: user.country_code,
        country_name: user.country_name
      },
    });
  } catch (err) {
    return next(err);
  }
};

// POST /api/user/upgrade-vendor
exports.upgradeToVendor = async (req, res, next) => {
  try {
    const { businessName, businessCategory, businessAddress } = req.body;
    if (!businessName || !businessCategory || !businessAddress) {
      return res.status(400).json({ success: false, message: 'All business details are required' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Self-healing: if country is missing, try to detect it
    if (!user.country_code) {
      let detected = { code: null, name: null };
      if (user.phone) detected = getCountryFromPhone(user.phone);
      if (!detected.code) detected = getCountryFromRequest(req);
      
      if (detected.code) {
        user.country_code = detected.code;
        user.country_name = detected.name;
        await user.save();
      }
    }

    // Restriction Check: Only PK and CN users can become vendors (Temporarily Disabled Globally)
    // if (!['PK', 'CN'].includes(user.country_code)) {
    //   return res.status(403).json({ 
    //     success: false, 
    //     message: 'Vendor accounts are currently only available for users in Pakistan and China. You can still purchase products as a regular customer.' 
    //   });
    // }

    if (user.role === 'vendor' || user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Account is already a vendor or admin' });
    }

    user.role = 'vendor';
    user.status = 'active';
    user.businessName = businessName;
    user.businessCategory = businessCategory;
    user.businessAddress = businessAddress;

    await user.save();

    return res.json({
      success: true,
      message: 'Upgrade successful. Your vendor account is now active.',
      data: { role: user.role, status: user.status }
    });
  } catch (err) {
    return next(err);
  }
};

// PUT /api/user/request-verification
exports.requestVerification = async (req, res, next) => {
  try {
    const { government_id_url } = req.body;
    if (!government_id_url) {
      return res.status(400).json({ success: false, message: 'Government ID is required' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.government_id_url = government_id_url;
    user.verification_status = 'pending';
    await user.save();

    return res.json({
      success: true,
      message: 'Verification request submitted. An admin will review it shortly.',
      data: { status: user.verification_status }
    });
  } catch (err) {
    return next(err);
  }
};

// POST /api/users/poll
exports.submitPoll = async (req, res, next) => {
  try {
    const { category, choice } = req.body;
    if (!category || !choice) {
      return res.status(400).json({ success: false, message: 'All poll fields are required' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check reset logic (7 days)
    if (user.last_poll_date) {
      const now = new Date();
      const last = new Date(user.last_poll_date);
      const diffTime = Math.abs(now - last);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 7) {
        return res.status(400).json({ 
          success: false, 
          message: 'You have already participated this week. Please try again later.',
          nextAvailableDate: new Date(last.getTime() + 7 * 24 * 60 * 60 * 1000)
        });
      }
    }

    user.poll_category = category;
    user.poll_choice = choice;
    user.last_poll_date = new Date();

    await user.save();

    return res.json({
      success: true,
      message: 'Poll submitted successfully!',
      data: { poll_category: user.poll_category, last_poll_date: user.last_poll_date }
    });
  } catch (err) {
    return next(err);
  }
};
// POST /api/user/buy-plan (Mock)
exports.buyPlan = async (req, res, next) => {
  try {
    const { plan } = req.body;
    if (!['free', 'starter', 'basic', 'star', 'premium'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Regional Plan Restrictions
    const isChina = user.country_code === 'CN';
    const isPakistan = user.country_code === 'PK';

    if (!isChina && !isPakistan) {
      return res.status(403).json({ 
        success: false, 
        message: 'Vendor plans are not available in your country. You can still purchase products as a regular customer.' 
      });
    }

    if (isChina && !['basic', 'star'].includes(plan)) {
      return res.status(403).json({ success: false, message: 'Chinese vendors can only purchase Featured (Basic) or Premium (Star) plans.' });
    }

    if (isChina && (plan === 'starter' || plan === 'free')) {
      return res.status(403).json({ success: false, message: 'This plan is not available for vendors in China.' });
    }

    // Upgrade-Only Enforcement
    const planPriority = { 'free': 0, 'basic': 1, 'star': 2, 'premium': 3 };
    const currentPlan = user.subscription_plan || 'free';
    
    if (plan !== 'starter' && planPriority[plan] < planPriority[currentPlan]) {
      return res.status(403).json({ 
        success: false, 
        message: `You are currently on the ${currentPlan} plan. Downgrades are not permitted while an active higher-tier plan exists.` 
      });
    }

    if (plan === 'starter') {
      user.extra_slots_purchased = (user.extra_slots_purchased || 0) + 1;
      await user.save();
      return res.json({
        success: true,
        message: 'Successfully purchased an extra Starter slot.',
        data: { extra_slots_purchased: user.extra_slots_purchased }
      });
    }

    const now = Date.now();
    const duration = 30 * 24 * 60 * 60 * 1000;
    const newExpiry = new Date(now + duration);
    
    if (plan === 'basic') {
      user.basic_plan_expires_at = newExpiry;
    } else if (plan === 'star') {
      user.star_plan_expires_at = newExpiry;
    } else if (plan === 'premium') {
      user.premium_plan_expires_at = newExpiry;
    }

    // Recalculate main plan
    const futurePremium = user.premium_plan_expires_at && new Date(user.premium_plan_expires_at) > new Date();
    const futureStar = user.star_plan_expires_at && new Date(user.star_plan_expires_at) > new Date();
    const futureBasic = user.basic_plan_expires_at && new Date(user.basic_plan_expires_at) > new Date();
    user.subscription_plan = futurePremium ? 'premium' : (futureStar ? 'star' : (futureBasic ? 'basic' : 'free'));
    
    await user.save();

    // --- Automatic Ad Promotion Logic ---
    if (['basic', 'star', 'premium'].includes(plan)) {
      let lowerTiers = [];
      if (plan === 'premium') lowerTiers = ["'free'", "'basic'", "'star'"];
      else if (plan === 'star') lowerTiers = ["'free'", "'basic'"];
      else if (plan === 'basic') lowerTiers = ["'free'"];

      if (lowerTiers.length > 0) {
        const promoLimit = plan === 'basic' ? 10 : (plan === 'star' ? 20 : 1000000);
        await sequelize.query(
          `UPDATE deals SET plan_type = $1, active_until = NOW() + INTERVAL '30 days' 
           WHERE id IN (
             SELECT id FROM deals 
             WHERE "userId" = $2 AND status = 'active' AND plan_type IN (${lowerTiers.join(',')})
             ORDER BY "createdAt" DESC
             LIMIT $3
           )`,
          { bind: [plan, user.id, promoLimit] }
        );
      }
    }

    return res.json({
      success: true,
      message: `Successfully upgraded to ${plan} plan. Your existing ads have been promoted!`,
      data: { subscription_plan: user.subscription_plan }
    });
  } catch (err) {
    return next(err);
  }
};
