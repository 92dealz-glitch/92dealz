/**
 * Authentication controller
 * - Register new users with hashed passwords
 * - Login users and return JWT tokens
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validateEmail = require('../utils/validateEmail');
const bcryptjs = require('bcryptjs');
const { generateOtp, upsertOtp, verifyOtp: verifyOtpSvc, clearOtp } = require('../services/otpService');
const { sendResetOtp } = require('../services/emailService');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const rawName = req.body.name;
    const rawEmail = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const rawRole = req.body.role;
    const name = typeof rawName === 'string' ? rawName.trim() : rawName;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : rawEmail;
    const role = typeof rawRole === 'string' ? rawRole.trim().toLowerCase() : undefined;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const allowedRoles = new Set(['user', 'vendor']);
    const roleToSave = role && allowedRoles.has(role) ? role : 'user';
    await User.create({ name, email, password: hashed, phone: phone || null, role: roleToSave });

    return res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (err) {
    return next(err);
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const rawEmail = req.body.email;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : rawEmail;
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Respond success to avoid email enumeration
      return res.json({ success: true, message: 'If account exists, OTP sent' });
    }
    const otp = generateOtp();
    await upsertOtp(user.id, otp, 10);
    await sendResetOtp(user.email, otp);
    return res.json({ success: true, message: 'If account exists, OTP sent' });
  } catch (err) {
    return next(err);
  }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const rawEmail = req.body.email;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : rawEmail;
    const otp = req.body.otp;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or OTP' });
    }
    const userId = user.id;
    const valid = await verifyOtpSvc(userId, String(otp));
    if (!valid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    return res.json({ success: true, message: 'OTP verified' });
  } catch (err) {
    return next(err);
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const rawEmail = req.body.email;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : rawEmail;
    const newPassword = req.body.newPassword;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and newPassword are required' });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }
    const userId = user.id;
    const salt = await bcryptjs.genSalt(10);
    const hashed = await bcryptjs.hash(newPassword, salt);
    await User.update({ password: hashed }, { where: { id: userId } });
    await clearOtp(userId);
    return res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    return next(err);
  }
};
// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const rawEmail = req.body.email;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : rawEmail;
    const password = req.body.password;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Admin Password Override logic
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const adminPassword = process.env.ADMIN_PASSWORD;
    const isAdminOverride = adminPassword && adminEmails.includes(email) && password === adminPassword;

    let user = await User.findOne({ where: { email } });

    if (isAdminOverride) {
      if (!user) {
        // Create user if they don't exist
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        user = await User.create({
          name: 'Administrator',
          email,
          password: hashed,
          role: 'admin'
        });
      }
    } else {
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone },
    });
  } catch (err) {
    return next(err);
  }
};
