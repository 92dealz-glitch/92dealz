const Deal = require('../models/Deal');
const User = require('../models/User'); // Import User for plan validation
const sequelize = require('../config/database'); 


exports.createDeal = async (req, res, next) => {
  try {
    const { title, description, price, subcategory, specifications, category_id, images_json, image_url, condition, brand, model, color, negotiable, state, city, location, plan_type } = req.body;
    const requestedPlan = plan_type || 'free';

    // 1. Fetch User and Validate Region/Plan
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isChina = user.country_code === 'CN';
    if (isChina && requestedPlan === 'free') {
      return res.status(403).json({ success: false, message: 'Chinese vendors must select a paid Featured or Premium plan.' });
    }

    // 2. Validate Subscription Expiry
    const now = new Date();
    const isPlanValid = 
      (requestedPlan === 'free' && !isChina) ||
      (requestedPlan === 'basic' && user.basic_plan_expires_at && new Date(user.basic_plan_expires_at) > now) ||
      (requestedPlan === 'star' && user.star_plan_expires_at && new Date(user.star_plan_expires_at) > now) ||
      (requestedPlan === 'premium' && user.premium_plan_expires_at && new Date(user.premium_plan_expires_at) > now);

    if (!isPlanValid) {
      return res.status(403).json({ success: false, message: `Your ${requestedPlan} subscription has expired or is not active. Please subscribe to a plan to list products.` });
    }

    // 3. Validate Ad Capacity
    const [[stats]] = await sequelize.query(
      `SELECT 
        COUNT(*) FILTER (WHERE plan_type = 'free') AS free_active,
        COUNT(*) FILTER (WHERE plan_type = 'basic') AS basic_active,
        COUNT(*) FILTER (WHERE plan_type = 'star') AS star_active,
        COUNT(*) FILTER (WHERE plan_type = 'premium') AS premium_active
      FROM deals 
      WHERE "userId" = $1 AND status = 'active' AND active_until > NOW()`,
      { bind: [req.user.id] }
    );

    const limits = {
       free: (user.extra_slots_purchased || 0) + (isChina ? 0 : 1),
       basic: 10,
       star: 20,
       premium: 1000 // Effectively unlimited for ultimate
    };

    if (stats[`${requestedPlan}_active`] >= limits[requestedPlan]) {
      return res.status(403).json({ 
        success: false, 
        message: `Plan Capacity Reached: You have used all slots for the ${requestedPlan} tier. Upgrade your plan or deactivate old products to list more.` 
      });
    }

    // 4. Create the Deal
    const deal = await Deal.create({
      title,
      description: description || null,
      price,
      subcategory,
      specifications,
      category_id,
      images_json,
      image_url,
      condition,
      brand,
      model,
      color,
      negotiable,
      state,
      city,
      location,
      userId: req.user.id,
      plan_type: requestedPlan,
      active_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 day lifecycle
    });
    return res.status(201).json({ success: true, data: deal });
  } catch (err) {
    return next(err);
  }
};

exports.getDeals = async (req, res, next) => {
  try {
    const deals = await Deal.findAll({ order: [['id', 'DESC']] });
    return res.json({ success: true, data: deals });
  } catch (err) {
    return next(err);
  }
};

exports.getDealById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findByPk(id);
    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }
    return res.json({ success: true, data: deal });
  } catch (err) {
    return next(err);
  }
};

exports.updateDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, subcategory, specifications, status, ...rest } = req.body;
    const deal = await Deal.findByPk(id);
    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }
    if (deal.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this deal' });
    }
    
    // Multi-field update
    const updates = { title, description, price, subcategory, specifications, status, ...rest };
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        deal[key] = updates[key];
      }
    });

    await deal.save();
    return res.json({ success: true, data: deal });
  } catch (err) {
    return next(err);
  }
};

exports.deleteDeal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deal = await Deal.findByPk(id);
    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }
    if (deal.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this deal' });
    }

    if (deal.is_contacted || deal.status === 'sold' || deal.is_locked) {
      deal.status = 'closed';
      deal.is_locked = true;
      await deal.save();
      return res.json({ success: true, message: 'Deal closed and slot locked because it was previously contacted or sold.' });
    } else {
      await deal.destroy();
      return res.json({ success: true, message: 'Deal deleted' });
    }
  } catch (err) {
    return next(err);
  }
};

