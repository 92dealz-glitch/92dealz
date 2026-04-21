/**
 * Authentication routes
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const auth = require('../middleware/authMiddleware');

const { authRateLimiter } = require('../middleware/rateLimiter');

router.get('/detect-country', authController.detectCountry);
router.post('/register', authRateLimiter, authController.register);
router.post('/signup', authRateLimiter, authController.register);
router.post('/register-initiate', authRateLimiter, authController.registerInitiate);
router.post('/register-verify', authRateLimiter, authController.registerVerify);
router.post('/login', authRateLimiter, authController.login);
router.post('/forgot-password', authRateLimiter, authController.forgotPassword);
router.post('/verify-otp', authRateLimiter, authController.verifyOtp);
router.post('/reset-password', authRateLimiter, authController.resetPassword);
router.put('/change-password', auth, authController.changePassword);

// New verification routes for logged-in users
router.post('/send-verification-otp', auth, authController.sendVerificationOtp);
router.post('/verify-contact-otp', auth, authController.verifyContactOtp);

// Alias routes for legacy compatibility
router.post('/send-phone-otp', auth, authController.sendVerificationOtp);
router.post('/verify-phone-otp', auth, authController.verifyContactOtp);

module.exports = router;
