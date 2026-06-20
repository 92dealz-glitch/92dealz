const crypto = require('crypto');
const fetch = require('node-fetch');
const Payment = require('../models/Payment');
const User = require('../models/userModel');
const sequelize = require('../config/database');

// Internal pricing map (Source of Truth)
const PRICING = {
  PK: {
    currency: 'PKR',
    plans: {
      starter: 100000,   // PKR 1,000 (if using lowest denomination, say cents/paisa. Let's just use exact amount here as Paystack is disabled)
      basic: 500000,     // PKR 5,000
      star: 1500000,     // PKR 15,000
      premium: 50000000  // PKR 500,000
    }
  },
  CN: {
    currency: 'USD',
    plans: {
      basic: 999,        // $9.99 in cents
      star: 2499         // $24.99 in cents
    }
  }
};

const planPriority = { 'free': 0, 'basic': 1, 'star': 2, 'premium': 3 };

/**
 * Initialize Payment
 */
exports.initializePayment = async (req, res, next) => {
  try {
    const { planId, email } = req.body;
    
    if (!planId) {
      return res.status(400).json({ success: false, message: 'planId is required' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const countryCode = user.country_code;
    const isChina = countryCode === 'CN';
    const isPakistan = countryCode === 'PK';

    if (!isChina && !isPakistan) {
      // Temporarily allowing all countries to become vendors. Defaulting to PK for non-CN.
      // return res.status(403).json({ 
      //   success: false, 
      //   message: 'Vendor plans are not available in your country.' 
      // });
    }

    const pricingRegion = isChina ? 'CN' : 'PK';
    const regionConfig = PRICING[pricingRegion];

    if (!regionConfig.plans[planId]) {
      return res.status(403).json({ 
        success: false, 
        message: `Plan ${planId} is not available for ${countryCode}.` 
      });
    }

    // Upgrade-Only Enforcement
    const currentPlan = user.subscription_plan || 'free';
    
    if (planId !== 'starter' && planPriority[planId] < planPriority[currentPlan]) {
      return res.status(403).json({ 
        success: false, 
        message: `You are currently on the ${currentPlan} plan. Downgrades are not permitted while an active higher-tier plan exists.` 
      });
    }

    const amount = regionConfig.plans[planId];
    const currency = regionConfig.currency;

    // Generate reference
    const reference = `ref_${Date.now()}_${user.id}_${crypto.randomBytes(4).toString('hex')}`;

    // Create pending payment record
    await Payment.create({
      userId: user.id,
      planId,
      amount,
      currency,
      reference,
      status: 'pending' // Note: Currently skipping payment gateway
    });

    // Mock bypass for payment integration as requested
    // Auto-complete subscription for now
    const pendingPayment = await Payment.findOne({ where: { reference } });
    if (pendingPayment) {
      pendingPayment.status = 'success';
      await pendingPayment.save();
      await processSubscription(pendingPayment);
    }

    return res.json({
      success: true,
      authorization_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pricing?mock_success=true`,
      reference: reference
    });

  } catch (err) {
    return next(err);
  }
};

/**
 * Handle successful payment logic
 * Reusable function called by Webhook
 */
async function processSubscription(payment) {
  const user = await User.findByPk(payment.userId);
  if (!user) return false;

  const plan = payment.planId;

  if (plan === 'starter') {
    user.extra_slots_purchased = (user.extra_slots_purchased || 0) + 1;
    await user.save();
    return true;
  }

  const now = Date.now();
  const duration = 30 * 24 * 60 * 60 * 1000;
  const newExpiry = new Date(now + duration);
  
  if (plan === 'basic') {
    user.basic_plan_expires_at = newExpiry;
  } else if (plan === 'star') {
    user.star_plan_expires_at = newExpiry;
  } else if (plan === 'premium') {
    user.premium_plan_expires_at = newExpiry;
  }

  const futurePremium = user.premium_plan_expires_at && new Date(user.premium_plan_expires_at) > new Date();
  const futureStar = user.star_plan_expires_at && new Date(user.star_plan_expires_at) > new Date();
  const futureBasic = user.basic_plan_expires_at && new Date(user.basic_plan_expires_at) > new Date();
  user.subscription_plan = futurePremium ? 'premium' : (futureStar ? 'star' : (futureBasic ? 'basic' : 'free'));
  
  await user.save();

  // Automatic Ad Promotion Logic
  if (['basic', 'star', 'premium'].includes(plan)) {
    let lowerTiers = [];
    if (plan === 'premium') lowerTiers = ["'free'", "'basic'", "'star'"];
    else if (plan === 'star') lowerTiers = ["'free'", "'basic'"];
    else if (plan === 'basic') lowerTiers = ["'free'"];

    if (lowerTiers.length > 0) {
      const promoLimit = plan === 'basic' ? 10 : (plan === 'star' ? 20 : 1000000);
      await sequelize.query(
        `UPDATE deals SET plan_type = $1, active_until = NOW() + INTERVAL '30 days' 
         WHERE id IN (
           SELECT id FROM deals 
           WHERE "userId" = $2 AND status = 'active' AND plan_type IN (${lowerTiers.join(',')})
           ORDER BY "createdAt" DESC
           LIMIT $3
         )`,
        { bind: [plan, user.id, promoLimit] }
      );
    }
  }

  return true;
}

/**
 * Paystack Webhook endpoint
 */
exports.paystackWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    // When using express.raw(), req.body is a Buffer
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).send('Webhook error: Expected raw buffer body.');
    }
    
    const hash = crypto.createHmac('sha512', secret).update(req.body).digest('hex');
    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(403).send('Invalid signature');
    }

    // Parse the buffer safely to get the JSON event
    const event = JSON.parse(req.body.toString());

    if (event.event === 'charge.success') {
      const data = event.data;
      const reference = data.reference;

      const payment = await Payment.findOne({ where: { reference } });
      
      if (!payment) {
        return res.status(400).send('Payment reference not found');
      }

      // Idempotency: if already success, do nothing
      if (payment.status === 'success') {
        return res.status(200).send('Already processed');
      }

      // Strict Validation
      if (data.status !== 'success' || data.amount !== payment.amount || data.currency !== payment.currency) {
        payment.status = 'failed';
        await payment.save();
        return res.status(400).send('Validation failed');
      }

      // Update payment
      payment.status = 'success';
      await payment.save();

      // Process subscription
      await processSubscription(payment);
    }

    return res.status(200).send('Webhook received successfully');
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).send('Internal Server Error');
  }
};

/**
 * Verify Payment via API
 * Used by frontend to confirm payment if they missed the webhook UI update
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;
    
    if (!reference) {
      return res.status(400).json({ success: false, message: 'Reference required' });
    }

    const payment = await Payment.findOne({ where: { reference } });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    // Security: Only the user who initiated it can verify it via this endpoint
    if (payment.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    if (payment.status === 'success') {
      return res.json({ success: true, message: 'Payment successful', data: { plan: payment.planId } });
    }

    if (payment.status === 'failed') {
      return res.json({ success: false, message: 'Payment failed previously' });
    }

    // If pending, explicitly verify with Paystack just in case Webhook was missed
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });
    
    const data = await response.json();
    
    if (data.status && data.data.status === 'success') {
      // Validate
      if (data.data.amount === payment.amount && data.data.currency === payment.currency) {
        payment.status = 'success';
        await payment.save();
        await processSubscription(payment);
        return res.json({ success: true, message: 'Payment verified and successful', data: { plan: payment.planId } });
      } else {
        payment.status = 'failed';
        await payment.save();
        return res.json({ success: false, message: 'Amount/Currency mismatch' });
      }
    } else if (data.status && data.data.status === 'failed') {
      payment.status = 'failed';
      await payment.save();
      return res.json({ success: false, message: 'Payment failed at gateway' });
    }

    return res.json({ success: false, message: 'Payment is still pending' });

  } catch (err) {
    return next(err);
  }
};
