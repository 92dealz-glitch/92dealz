/**
 * Authentication routes
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/signup', authController.register);
router.post('/register-initiate', authController.registerInitiate);
router.post('/register-verify', authController.registerVerify);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOtp);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
