/**
 * User controller
 * - Implements REST actions using Sequelize models
 * - All handlers are async and forward errors to centralized error middleware
 */
const sequelize = require('../config/database');
const User = require('../models/userModel');

// POST /api/users/create
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.create({ name, email, phone: phone || null, password });
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
      attributes: ['id', 'name', 'email', 'phone', 'role', 'profile_image_url', 'createdAt', 'businessName', 'businessCategory', 'businessAddress', 'rating', 'responseTime', 'about', 'is_verified'],
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
      attributes: ['id', 'name', 'email', 'phone', 'profile_image_url', 'createdAt', 'businessName', 'businessCategory', 'businessAddress', 'rating', 'responseTime', 'about', 'is_verified'],
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
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
      attributes: ['id', 'name', 'email', 'phone', 'profile_image_url', 'createdAt', 'updatedAt', 'role', 'businessName', 'businessCategory', 'businessAddress', 'rating', 'responseTime', 'is_verified', 'verification_status', 'government_id_url'],
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, data: user });
  } catch (err) {
    return next(err);
  }
};

// PUT /api/user/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, profile_image_url, businessName, businessCategory, businessAddress, about } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (typeof name === 'string') user.name = name;
    if (typeof phone === 'string' || phone === null) user.phone = phone || null;
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
        is_verified: user.is_verified
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

    if (user.role === 'vendor' || user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Account is already a vendor or admin' });
    }

    user.role = 'vendor';
    user.status = 'pending';
    user.businessName = businessName;
    user.businessCategory = businessCategory;
    user.businessAddress = businessAddress;

    await user.save();

    return res.json({
      success: true,
      message: 'Upgrade request submitted. Your vendor account is pending approval.',
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
