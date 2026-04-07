const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Helper to sanitize staff object
const sanitizeStaff = (user) => {
  const { password, ...rest } = user.toJSON();
  return rest;
};

// GET /api/admin/staff
exports.getAllStaff = async (req, res, next) => {
  try {
    const staff = await User.findAll({
      where: { role: 'csr' },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: staff.map(sanitizeStaff) });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/staff
exports.createStaff = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ where: { email: normalizedEmail } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
      role: 'csr',
      status: 'active',
      is_verified: true,
      verification_status: 'approved',
      total_time_spent: 0,
    });

    res.status(201).json({ success: true, message: 'Staff created successfully', data: sanitizeStaff(newStaff) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/staff/:id
exports.updateStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note, status, password, name, phone } = req.body;

    const staff = await User.findOne({ where: { id, role: 'csr' } });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    if (note !== undefined) staff.note = note;
    if (status !== undefined) staff.status = status;
    if (name !== undefined) staff.name = name;
    if (phone !== undefined) staff.phone = phone;
    
    if (password) {
      staff.password = await bcrypt.hash(password, 10);
    }

    await staff.save();
    res.json({ success: true, message: 'Staff updated successfully', data: sanitizeStaff(staff) });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/staff/:id
exports.deleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const staff = await User.findOne({ where: { id, role: 'csr' } });
    
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff not found' });
    }

    await staff.destroy();
    res.json({ success: true, message: 'Staff deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/staff/ping (For CSRs to log their active time)
exports.pingStaff = async (req, res, next) => {
  try {
    // req.user comes from auth middleware
    if (!req.user || req.user.role !== 'csr') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const staff = await User.findByPk(req.user.id);
    if (!staff) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Ping every 60 seconds -> adds 60 to total
    staff.total_time_spent = (staff.total_time_spent || 0) + 60;
    staff.last_seen = new Date();
    await staff.save();

    res.json({ success: true });
  } catch (err) {
    // Only logging error, don't want to alert frontend if it fails since it's background
    console.error('Staff ping error:', err);
    res.status(500).json({ success: false });
  }
};
