const sequelize = require('../config/database');
const Deal = require('../models/Deal');
const Category = require('../models/Category');
const Store = require('../models/Store');
const Submission = require('../models/Submission');
const { notifyAlertsForDeal } = require('../services/alertNotifier');
const { sendGeneric } = require('../services/emailService');

// Deals
exports.getDeals = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.max(parseInt(req.query.limit || '100', 10), 1);
    const offset = (page - 1) * limit;

    const [rows] = await sequelize.query(
      `SELECT d.id, d.title, d.price, d.status, d."updatedAt",
              u.name as merchant,
              c.name as category,
              (SELECT COUNT(*)::INT FROM click_events ce WHERE ce.deal_id = d.id AND ce.type = 'view') as clicks
       FROM deals d
       LEFT JOIN users u ON u.id = d."userId"
       LEFT JOIN categories c ON c.id = d.category_id
       ORDER BY d.id DESC
       LIMIT $1 OFFSET $2`,
      { bind: [limit, offset] }
    );

    const [[{ count }]] = await sequelize.query(`SELECT COUNT(*)::INT as count FROM deals`);

    return res.json({ 
      success: true, 
      data: rows, 
      meta: { page, limit, total: count, pages: Math.ceil(count / limit) } 
    });
  } catch (err) {
    return next(err);
  }
};

exports.createDeal = async (req, res, next) => {
  try {
    const { title, description, price, userId, category_id, store_id } = req.body;
    const deal = await Deal.create({
      title,
      description: description || null,
      price,
      userId: userId || req.user.id,
      ...(category_id ? { category_id } : {}),
      ...(store_id ? { store_id } : {}),
    });
    try {
      await notifyAlertsForDeal({ title: deal.title, price: deal.price, category_id: deal.category_id }, sendGeneric);
    } catch (_) {}
    return res.status(201).json({ success: true, data: deal });
  } catch (err) {
    return next(err);
  }
};

exports.updateDeal = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deal = await Deal.findByPk(id);
    if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
    const { title, description, price, category_id, store_id } = req.body;
    if (title !== undefined) deal.title = title;
    if (description !== undefined) deal.description = description;
    if (price !== undefined) deal.price = price;
    if (category_id !== undefined) deal.category_id = category_id;
    if (store_id !== undefined) deal.store_id = store_id;
    await deal.save();
    return res.json({ success: true, data: deal });
  } catch (err) {
    return next(err);
  }
};

exports.deleteDeal = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deal = await Deal.findByPk(id);
    if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
    await deal.destroy();
    return res.json({ success: true, message: 'Deal deleted' });
  } catch (err) {
    return next(err);
  }
};

// Categories
exports.getCategories = async (req, res, next) => {
  try {
    const [rows] = await sequelize.query(
      `SELECT c.id, c.name, c.slug,
              (SELECT COUNT(*)::INT FROM deals d WHERE d.category_id = c.id) as items
       FROM categories c
       ORDER BY c.id ASC`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    return next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug } = req.body;
    const cat = await Category.create({ name, slug });
    return res.status(201).json({ success: true, data: cat });
  } catch (err) {
    return next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    const { name, slug } = req.body;
    if (name !== undefined) cat.name = name;
    if (slug !== undefined) cat.slug = slug;
    await cat.save();
    return res.json({ success: true, data: cat });
  } catch (err) {
    return next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    await cat.destroy();
    return res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    return next(err);
  }
};

// Stores
exports.getStores = async (req, res, next) => {
  try {
    const items = await Store.findAll({ order: [['id', 'ASC']] });
    return res.json({ success: true, data: items });
  } catch (err) {
    return next(err);
  }
};

exports.createStore = async (req, res, next) => {
  try {
    const { name, logo, website_url } = req.body;
    const store = await Store.create({ name, logo: logo || null, website_url: website_url || null });
    return res.status(201).json({ success: true, data: store });
  } catch (err) {
    return next(err);
  }
};

exports.updateStore = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
    const { name, logo, website_url } = req.body;
    if (name !== undefined) store.name = name;
    if (logo !== undefined) store.logo = logo;
    if (website_url !== undefined) store.website_url = website_url;
    await store.save();
    return res.json({ success: true, data: store });
  } catch (err) {
    return next(err);
  }
};

exports.deleteStore = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
    await store.destroy();
    return res.json({ success: true, message: 'Store deleted' });
  } catch (err) {
    return next(err);
  }
};
// Submissions
exports.getSubmissions = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '0', 10), 0);
    const limit = Math.max(parseInt(req.query.limit || '0', 10), 0);
    if (page && limit) {
      const offset = (page - 1) * limit;
      const { rows, count } = await Submission.findAndCountAll({ order: [['id', 'DESC']], limit, offset });
      return res.json({ success: true, data: rows, meta: { page, limit, total: count, pages: Math.ceil(count / limit) } });
    } else {
      const items = await Submission.findAll({ order: [['id', 'DESC']] });
      return res.json({ success: true, data: items });
    }
  } catch (err) {
    return next(err);
  }
};

exports.updateSubmission = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body; // 'APPROVED' or 'REJECTED'
    const sub = await Submission.findByPk(id);
    if (!sub) return res.status(404).json({ success: false, message: 'Submission not found' });
    if (status !== 'APPROVED' && status !== 'REJECTED') {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    sub.status = status;
    await sub.save();
    if (status === 'APPROVED') {
      await Deal.create({
        title: sub.title,
        description: sub.description || null,
        price: sub.price,
        userId: sub.user_id,
        ...(sub.category_id ? { category_id: sub.category_id } : {}),
        ...(sub.store_id ? { store_id: sub.store_id } : {}),
        image_url: sub.image_url || null,
        images_json: sub.images_json || null,
      });
      try {
        await notifyAlertsForDeal({ title: sub.title, price: sub.price, category_id: sub.category_id }, sendGeneric);
      } catch (_) {}
    }
    return res.json({ success: true, data: sub });
  } catch (err) {
    return next(err);
  }
};

// Admin managing Vendors
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getVendors = async (req, res, next) => {
  try {
    const vendors = await User.findAll({
      where: { role: 'vendor' },
      attributes: ['id', 'name', 'email', 'phone', 'status', 'businessName', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, data: vendors });
  } catch (err) {
    return next(err);
  }
};

exports.updateVendorStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    
    if (!['pending', 'active', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    
    const vendor = await User.findOne({ where: { id, role: 'vendor' } });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }
    
    vendor.status = status;
    await vendor.save();
    
    // Optionally: Send an email to the vendor notifying them of approval/rejection
    
    return res.json({ success: true, message: 'Vendor status updated', data: { id: vendor.id, status: vendor.status } });
  } catch (err) {
    return next(err);
  }
};

exports.createVendor = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const vendor = await User.create({
      name,
      email,
      password: hashed,
      phone: phone || null,
      role: 'vendor',
      status: 'active' // Admin-created vendors are active by default
    });
    return res.status(201).json({ success: true, data: { id: vendor.id, name: vendor.name, email: vendor.email } });
  } catch (err) {
    return next(err);
  }
};
