const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/authMiddleware');

// The webhook MUST not use requireAuth since it's called by Paystack
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.paystackWebhook);

// Protected routes for the user
router.post('/initialize', requireAuth, paymentController.initializePayment);
router.get('/verify/:reference', requireAuth, paymentController.verifyPayment);

module.exports = router;
