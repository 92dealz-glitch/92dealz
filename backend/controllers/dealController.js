const Deal = require('../models/Deal');

exports.createDeal = async (req, res, next) => {
  try {
    const { title, description, price } = req.body;
    const deal = await Deal.create({
      title,
      description: description || null,
      price,
      userId: req.user.id,
    });
    return res.status(201).json({ success: true, data: deal });
  } catch (err) {
    return next(err);
  }
};

exports.getDeals = async (req, res, next) => {
  try {
    const deals = await Deal.findAll({ order: [['id', 'ASC']] });
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
    const { title, description, price } = req.body;
    const deal = await Deal.findByPk(id);
    if (!deal) {
      return res.status(404).json({ success: false, message: 'Deal not found' });
    }
    if (deal.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this deal' });
    }
    if (typeof title === 'string') deal.title = title;
    if (typeof description === 'string' || description === null) deal.description = description || null;
    if (typeof price !== 'undefined') deal.price = price;
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
    if (deal.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this deal' });
    }
    await deal.destroy();
    return res.json({ success: true, message: 'Deal deleted' });
  } catch (err) {
    return next(err);
  }
};

