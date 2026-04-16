const Deal = require('../models/Deal');

exports.createDeal = async (req, res, next) => {
  try {
    const { title, description, price, subcategory, specifications, category_id, images_json, image_url, condition, brand, model, color, negotiable, state, city, location } = req.body;
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

