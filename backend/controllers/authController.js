/**
 * Authentication controller
 * - Register new users with hashed passwords
 * - Login users and return JWT tokens
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const validateEmail = require('../utils/validateEmail');
const formatPhone = require('../utils/formatPhone');
const { generateOtp, upsertOtp, verifyOtp } = require('../services/otpService');
const { sendResetOtp, sendSignupOtp } = require('../services/emailService');
const PendingRegistration = require('../models/PendingRegistration');
const PasswordReset = require('../models/PasswordReset');
const { Op } = require('sequelize');
const { sendTermiiOtp, verifyTermiiOtp } = require('../services/termiiService');
const { sendAlibabaOtp } = require('../services/alibabaSmsService');
const { sendTwilioOtp, verifyTwilioOtp } = require('../services/twilioService');
const verifyRecaptcha = require('../utils/verifyRecaptcha');
const geoip = require('geoip-lite');
const { parsePhoneNumber } = require('libphonenumber-js');
const { getCountryFromRequest, getCountryFromPhone } = require('../utils/locationUtils');

// Location helpers moved to locationUtils.js

// GET /api/auth/detect-country
exports.detectCountry = async (req, res, next) => {
  try {
    const detectedCountry = getCountryFromRequest(req);
    return res.json({ success: true, ...detectedCountry });
  } catch (err) {
    return next(err);
  }
};

/* POST /api/auth/register-initiate */
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

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const signupData = { ...req.body, password: hashed };
    if (signupData.phone) signupData.phone = formatPhone(signupData.phone);

    await PendingRegistration.destroy({ where: { contact } });

    // Generate OTP for both phone and email methods using the service function
    let otpValue;
    otpValue = generateOtp();
    // Unconditional dev log for OTP (appears in any environment)
    console.log(`\n========================================`);
    console.log(`DEV OTP FOR TESTING`);
    console.log(`Phone: ${contact}`);
    console.log(`OTP: ${otpValue}`);
    console.log(`========================================\n`);
    if (method === 'phone') {
      // Log OTP to console for development/debugging (SMS gateways not wired yet)
      console.log(`\n==================================================`);
      console.log(`📱 [PHONE SIGNUP OTP CODE]: ${otpValue}`);
      console.log(`📞 PHONE: ${contact}`);
      console.log(`⏰ Expires in 10 minutes`);
      console.log(`==================================================\n`);
      // Store OTP in Redis for phone verification flow
      await upsertOtp(contact, otpValue);
      console.log('[OTP STORE] stored OTP for phone contact', contact);
    } else {
      // Store OTP in Redis BEFORE sending response
      await upsertOtp(contact, otpValue);
      console.log('[OTP GENERATE] payload:', { method, contact }, 'stored OTP');
      await sendSignupOtp(contact, otpValue);
    }

    try {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      // Detect country from request
      const detectedCountry = getCountryFromRequest(req);
      signupData.country_code = detectedCountry.code;
      signupData.country_name = detectedCountry.name;

      await PendingRegistration.create({
        contact,
        otp: otpValue,
        data: JSON.stringify(signupData),
        expires_at: expiresAt,
      });

      if (method === 'email') {
        await sendSignupOtp(contact, otpValue);
        return res.json({ success: true, message: 'Verification code sent to email' });
      } else {
        const isPakistan = contact.startsWith('+92');
        return res.json({ success: true, message: `Verification code sent to ${isPakistan ? 'phone' : 'international phone'}` });
      }
    } catch (err) {
      console.error('OTP Registration storage/dispatch failed:', err);
      return res.status(500).json({ success: false, message: `Failed to initiate registration: ${err.message}` });
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
      if (pending.otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid Phone OTP' });
      }
    } else {
      if (pending.otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid Email OTP' });
      }
    }

    let signupData;
    try {
      signupData = JSON.parse(pending.data);
    } catch (parseErr) {
      console.error('Failed to parse pending registration data:', parseErr);
      return res.status(500).json({ success: false, message: 'Corrupted registration data. Please restart registration.' });
    }
    // Extract needed fields from signupData
    const name = signupData.name;
    const password = signupData.password;
    const role = signupData.role;
    const businessName = signupData.businessName;
    const businessCategory = signupData.businessCategory;
    const businessAddress = signupData.businessAddress;

    const allowedRoles = new Set(['user', 'vendor']);
    const roleToSave = role && allowedRoles.has(role) ? role : 'user';
    const initialStatus = 'active';

    const emailToSave = method === 'email' ? contact : null;
    const phoneToSave = method === 'phone' ? contact : signupData.phone;

    const newUser = await User.create({
      name,
      email: emailToSave,
      password, // Already hashed in registerInitiate
      phone: phoneToSave,
      role: roleToSave,
      status: initialStatus,
      is_verified: false,
      verification_status: 'none',
      is_phone_verified: method === 'phone',
      is_email_verified: method === 'email',
      businessName: roleToSave === 'vendor' ? businessName : null,
      businessCategory: roleToSave === 'vendor' ? businessCategory : null,
      businessAddress: roleToSave === 'vendor' ? businessAddress : null,
      country_code: signupData.country_code,
      country_name: signupData.country_name,
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
      console.warn(`[AUTH_LOGIN_FAIL] User not found during login. Input: "${emailInput}", Formatted Phone attempted: "${formattedPhone}"`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.warn(`[AUTH_LOGIN_FAIL] Password mismatch for user ID: ${user.id} (${user.email}). Input role: ${user.role}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = { id: user.id, email: user.email, role: user.role, status: user.status };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, status: user.status, phone: user.phone },
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

    // Determine if request is authenticated
    const isAuthenticated = req.user && req.user.id;
    const userId = isAuthenticated ? req.user.id : null;
    const isPhone = method === 'phone';
    const formattedContact = isPhone ? formatPhone(contact) : contact.trim().toLowerCase();

    // Check if this contact is already verified by another user
    const where = isPhone ? { phone: formattedContact } : { email: formattedContact };
    const verificationField = isPhone ? 'is_phone_verified' : 'is_email_verified';
    const existing = await User.findOne({
      where: {
        ...where,
        [verificationField]: true,
        ...(isAuthenticated ? { id: { [Op.ne]: userId } } : {})
      }
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `${isPhone ? 'Phone' : 'Email'} is already verified by another account.`
      });
    }

    if (isPhone) {
      // Generate OTP and log it
      const otpValue = generateOtp();
      console.log(`\n==================================================`);
      console.log(`📱 [PHONE VERIFY OTP CODE]: ${otpValue}`);
      console.log(`📞 PHONE: ${formattedContact}`);
      console.log(`⏰ Expires in 10 minutes`);
      console.log(`==================================================\n`);
      
      // Unconditionally store the OTP locally so it can be verified
      await upsertOtp(formattedContact, otpValue);
      console.log('[OTP STORE] stored OTP for contact', formattedContact);
      
      return res.json({ success: true, message: `Verification code sent to phone` });
    } else {
      const otp = generateOtp();
      
      // Store the OTP locally
      await upsertOtp(formattedContact, otp);
      console.log('[OTP STORE] stored OTP for contact', formattedContact);
      
      await sendSignupOtp(formattedContact, otp); // Reusing signup template
      return res.json({ success: true, message: 'Verification code sent to your email' });
    }
  } catch (err) {
    return next(err);
  }
};
// POST /api/auth/verify-contact-otp

// Updated verifyContactOtp with enhanced logging and fallback
exports.verifyContactOtp = async (req, res, next) => {
  try {
    const { contact: rawContact, phone, method, otp } = req.body;
    let contact = rawContact || phone || (method === 'email' ? req.body.email?.trim().toLowerCase() : undefined);
    if (!contact || !method || !otp) {
      return res.status(400).json({ success: false, message: 'Contact, method, and OTP are required' });
    }
    const isPhone = method === 'phone';
    const formattedContact = isPhone ? formatPhone(contact) : contact.trim().toLowerCase();

    // Log request payload for debugging
    console.log('[OTP VERIFY] payload:', { method, contact: formattedContact, otp });

    // Optional: get authenticated user ID from Authorization header
    let authenticatedUserId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.id) {
          authenticatedUserId = decoded.id;
        }
      } catch (err) {
        console.error('[OTP VERIFY] Token decoding failed:', err.message);
      }
    }

    // Attempt to retrieve OTP from Redis (used for authenticated flows and registration)
    const { getOtp, consumeOtp } = require('../services/otpService');
    const storedOtp = await getOtp(formattedContact);
    if (storedOtp) {
      console.log('[OTP VERIFY] Found OTP in Redis for', formattedContact, ':', storedOtp);
      if (storedOtp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }
      // OTP matches – consume it
      await consumeOtp(formattedContact);
      // Mark verification on user if exists
      const user = authenticatedUserId 
        ? await User.findByPk(authenticatedUserId)
        : await User.findOne({ where: { [isPhone ? 'phone' : 'email']: formattedContact } });
      if (user) {
        if (isPhone) {
          user.is_phone_verified = true;
          user.phone = formattedContact;
        } else {
          user.is_email_verified = true;
          user.email = formattedContact;
        }
        await user.save();
        console.log(`[OTP VERIFY] Successfully verified and saved ${isPhone ? 'phone' : 'email'} for user ID: ${user.id}`);
      }
      return res.json({ success: true, message: `${isPhone ? 'Phone' : 'Email'} verified successfully` });
    }

    // Fallback to pending registration (used during signup flow)
    let pending = await PendingRegistration.findOne({ where: { contact: formattedContact } });
    // Additional fallback: try raw trimmed contact (no formatting) in case of mismatched format
    if (!pending) {
      const rawContact = contact.trim().toLowerCase();
      pending = await PendingRegistration.findOne({ where: { contact: rawContact } });
    }
    if (!pending) {
      console.warn('[OTP VERIFY] No pending OTP for contact', formattedContact);
      return res.status(400).json({ success: false, message: 'No pending OTP for this contact' });
    }
    // Check expiration
    if (pending.expires_at && pending.expires_at < new Date()) {
      await pending.destroy();
      return res.status(400).json({ success: false, message: 'OTP expired, please resend' });
    }
    if (pending.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    // OTP valid – clean up pending record
    await pending.destroy();
    // Mark verification on user if exists
    const user = authenticatedUserId 
      ? await User.findByPk(authenticatedUserId)
      : await User.findOne({ where: { [isPhone ? 'phone' : 'email']: formattedContact } });
    if (user) {
      if (isPhone) {
        user.is_phone_verified = true;
        user.phone = formattedContact;
      } else {
        user.is_email_verified = true;
        user.email = formattedContact;
      }
      await user.save();
      console.log(`[OTP VERIFY PENDING] Successfully verified and saved ${isPhone ? 'phone' : 'email'} for user ID: ${user.id}`);
    }
    return res.json({ success: true, message: `${isPhone ? 'Phone' : 'Email'} verified successfully` });
  } catch (err) {
    return next(err);
  }
};
