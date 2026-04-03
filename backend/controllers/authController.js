/**
 * Authentication controller
 * - Register new users with hashed passwords
 * - Login users and return JWT tokens
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const validateEmail = require('../utils/validateEmail');
const bcryptjs = require('bcryptjs');
const { generateOtp, upsertOtp, verifyOtp } = require('../services/otpService');
const { sendResetOtp, sendSignupOtp } = require('../services/emailService');
const PendingRegistration = require('../models/PendingRegistration');
const PasswordReset = require('../models/PasswordReset');
const { Op } = require('sequelize');
const { sendTermiiOtp, verifyTermiiOtp } = require('../services/termiiService');
const verifyRecaptcha = require('../utils/verifyRecaptcha');

function formatPhone(phoneInput) {
  if (!phoneInput) return phoneInput;
  let clean = phoneInput.replace(/[\s-()]/g, '');
  if (clean.startsWith('0') && clean.length === 11) {
    return '+234' + clean.substring(1);
  }
  if (clean.startsWith('234') && clean.length === 13) {
    return '+' + clean;
  }
  if (!clean.startsWith('+')) {
    if (clean.length === 10) return '+234' + clean;
    return '+' + clean;
  }
  return clean;
}

// POST /api/auth/register-initiate
exports.registerInitiate = async (req, res, next) => {
  try {
    const { password, name, phone, role, captchaToken } = req.body;
    
    // Verify reCAPTCHA
    const isValidCaptcha = await verifyRecaptcha(captchaToken);
    if (!isValidCaptcha) {
      return res.status(400).json({ success: false, message: 'Invalid reCAPTCHA. Please try again.' });
    }

    const method = req.body.method || 'email';
    let contact = req.body.contact ? req.body.contact.trim().toLowerCase() : req.body.email?.trim().toLowerCase();

    if (method === 'phone') {
      contact = formatPhone(contact);
    }

    if (!contact || !password || !name) {
      return res.status(400).json({ success: false, message: 'Name, contact (email/phone) and password are required' });
    }
    if (method === 'email' && !validateEmail(contact)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const whereClause = method === 'phone' ? { phone: contact } : { email: contact };
    const existing = await User.findOne({ where: whereClause });
    
    if (existing) {
      return res.status(409).json({ success: false, message: `This ${method} is already registered` });
    }

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Save phone from form additionally if email was method
    const signupData = { ...req.body, password: hashed };
    
    await PendingRegistration.destroy({ where: { contact } });

    if (method === 'phone') {
      try {
        const termiiRes = await sendTermiiOtp(contact);
        if (!termiiRes.pinId) {
          throw new Error('Termii failed to return a pinId');
        }

        await PendingRegistration.create({
          contact,
          otp: termiiRes.pinId, // Store pinId for verification
          data: JSON.stringify(signupData),
          expires_at: expiresAt
        });
        
        return res.json({ success: true, message: 'Verification code sent to phone via Termii' });
      } catch (err) {
        console.error('Termii SMS failed:', err);
        return res.status(500).json({ success: false, message: `Termii Error: ${err.message}` });
      }
    } else {
      try {
        const otp = generateOtp();
        await PendingRegistration.create({
          contact,
          otp,
          data: JSON.stringify(signupData),
          expires_at: expiresAt
        });
        await sendSignupOtp(contact, otp);
        return res.json({ success: true, message: 'Verification code sent to email' });
      } catch (mailErr) {
        console.error('Email delivery failed:', mailErr);
        return res.status(500).json({ success: false, message: 'Failed to send Verification email. Contact support.' });
      }
    }
  } catch (err) {
    console.error('Registration initiate error:', err);
    return next(err);
  }
};

// POST /api/auth/register-verify
exports.registerVerify = async (req, res, next) => {
  try {
    const method = req.body.method || 'email';
    let contact = req.body.contact ? req.body.contact.trim().toLowerCase() : req.body.email?.trim().toLowerCase();
    const otp = req.body.otp;

    if (method === 'phone') {
      contact = formatPhone(contact);
    }

    if (!contact || !otp) {
      return res.status(400).json({ success: false, message: 'Contact and OTP are required' });
    }

    const pending = await PendingRegistration.findOne({ where: { contact } });
    if (!pending || pending.expires_at < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP registration session' });
    }

    if (method === 'phone') {
      try {
        const pinId = pending.otp;
        const verification = await verifyTermiiOtp(pinId, otp);
        if (String(verification.verified).toLowerCase() !== 'true') {
          return res.status(400).json({ success: false, message: 'Invalid or expired Termii OTP' });
        }
      } catch (err) {
        console.error('Termii verify error:', err);
        return res.status(400).json({ success: false, message: 'Invalid or expired Termii OTP' });
      }
    } else {
      if (pending.otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid Email OTP' });
      }
    }

    const signupData = JSON.parse(pending.data);
    const { name, password, role, businessName, businessCategory, businessAddress } = signupData;

    const allowedRoles = new Set(['user', 'vendor']);
    const roleToSave = role && allowedRoles.has(role) ? role : 'user';
    const initialStatus = roleToSave === 'vendor' ? 'pending' : 'active';

    const emailToSave = method === 'email' ? contact : null;
    const phoneToSave = method === 'phone' ? contact : signupData.phone;

    const newUser = await User.create({
      name,
      email: emailToSave,
      password, // Already hashed in registerInitiate
      phone: phoneToSave,
      role: roleToSave,
      status: initialStatus,
      is_verified: true,
      is_phone_verified: method === 'phone',
      is_email_verified: method === 'email',
      businessName: roleToSave === 'vendor' ? businessName : null,
      businessCategory: roleToSave === 'vendor' ? businessCategory : null,
      businessAddress: roleToSave === 'vendor' ? businessAddress : null,
    });

    await pending.destroy();

    const payload = { id: newUser.id, email: newUser.email, role: newUser.role, status: newUser.status };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({ 
      success: true, 
      message: 'Registration successful', 
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role, status: newUser.status } 
    });
  } catch (err) {
    return next(err);
  }
};

// Legacy register
exports.register = async (req, res, next) => {
  return res.status(400).json({ success: false, message: 'Please use the updated verify-based registration endpoint' });
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { contact, method } = req.body;
    if (!contact) return res.status(400).json({ success: false, message: 'Contact is required' });

    const where = method === 'phone' ? { phone: contact } : { email: contact.trim().toLowerCase() };
    const user = await User.findOne({ where });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Block admins from using public forgot password flow
    if (user.role === 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin password reset is restricted. Please contact the system owner or reset from the dashboard.' 
      });
    }

    // Original behavior simulation or implementation
    return res.json({ success: false, message: 'Forgot password flow not fully connected for production yet' });
  } catch (err) {
    return next(err);
  }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  return res.json({ success: false, message: 'Not implemented for mixed auth yet' });
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  return res.json({ success: false, message: 'Not implemented for mixed auth yet' });
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const rawEmail = req.body.email;
    let emailInput = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : rawEmail;
    
    // Attempt format assuming it might be a phone number
    const formattedPhone = formatPhone(emailInput);
    const { password, captchaToken } = req.body;

    // Verify reCAPTCHA
    const isValidCaptcha = await verifyRecaptcha(captchaToken);
    if (!isValidCaptcha) {
      console.error(`[AUTH_LOGIN_FAIL] reCAPTCHA verification failed for email: ${emailInput}`);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid reCAPTCHA. Please try again.',
        debug: process.env.NODE_ENV === 'development' ? 'reCAPTCHA failed' : undefined
      });
    }

    if (!emailInput || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email/Phone and password are required',
        debug: !emailInput ? 'email missing' : 'password missing'
      });
    }

    let user = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email: emailInput },
          { phone: formattedPhone },
          { phone: emailInput }
        ]
      } 
    });

    if (!user) {
      console.log(`[AUTH_LOGIN_FAIL] User not found for input: ${emailInput} (formatted: ${formattedPhone})`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log(`[AUTH_LOGIN_FAIL] Password mismatch for user: ${emailInput}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = { id: user.id, email: user.email, role: user.role, status: user.status };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, phone: user.phone },
    });
  } catch (err) {
    return next(err);
  }
};

// PUT /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    return next(err);
  }
};

// POST /api/auth/send-verification-otp (authenticated)
exports.sendVerificationOtp = async (req, res, next) => {
  try {
    const { contact, method } = req.body;
    if (!contact || !method) {
      return res.status(400).json({ success: false, message: 'Contact and method are required' });
    }

    const userId = req.user.id;
    const isPhone = method === 'phone';
    const formattedContact = isPhone ? formatPhone(contact) : contact.trim().toLowerCase();

    // Check if this contact is already used by someone else
    const where = isPhone ? { phone: formattedContact } : { email: formattedContact };
    const existing = await User.findOne({ where: { ...where, id: { [Op.ne]: userId } } });
    if (existing) {
      return res.status(409).json({ success: false, message: `${isPhone ? 'Phone' : 'Email'} is already in use by another account` });
    }

    if (isPhone) {
      const termii = await sendTermiiOtp(formattedContact);
      if (!termii.pinId) throw new Error('Failed to send phone OTP');
      await upsertOtp(userId, termii.pinId); // Store pinId
      return res.json({ success: true, message: 'Verification code sent to your phone' });
    } else {
      const otp = generateOtp();
      await upsertOtp(userId, otp);
      await sendSignupOtp(formattedContact, otp); // Reusing nice signup template
      return res.json({ success: true, message: 'Verification code sent to your email' });
    }
  } catch (err) {
    return next(err);
  }
};

// POST /api/auth/verify-contact-otp (authenticated)
exports.verifyContactOtp = async (req, res, next) => {
  try {
    const { contact, method, otp } = req.body;
    if (!contact || !method || !otp) {
      return res.status(400).json({ success: false, message: 'Contact, method and OTP are required' });
    }

    const userId = req.user.id;
    const isPhone = method === 'phone';
    const formattedContact = isPhone ? formatPhone(contact) : contact.trim().toLowerCase();

    const record = await PasswordReset.findOne({ where: { user_id: userId } });
    if (!record || record.expires_at < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP expired or session not found' });
    }

    if (isPhone) {
      const pinId = record.otp;
      const verification = await verifyTermiiOtp(pinId, otp);
      if (String(verification.verified).toLowerCase() !== 'true') {
        return res.status(400).json({ success: false, message: 'Invalid or expired Phone OTP' });
      }
    } else {
      if (record.otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid Email OTP' });
      }
    }

    // Success! Update user
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (isPhone) {
      user.phone = formattedContact;
      user.is_phone_verified = true;
    } else {
      user.email = formattedContact;
      user.is_email_verified = true;
    }
    
    // Also set general is_verified
    user.is_verified = true;
    await user.save();
    
    // Explicitly delete the OTP record after success
    await record.destroy();

    return res.json({ success: true, message: `${isPhone ? 'Phone' : 'Email'} verified successfully` });
  } catch (err) {
    return next(err);
  }
};
