const crypto = require('crypto');
const redisClient = require('../config/redisClient');

// OTP expiry time in seconds (5 minutes)
const REDIS_OTP_TTL = 5 * 60;

/**
 * Generate a secure 6-digit OTP.
 */
function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Store or update an OTP for a given contact (phone or email).
 * Uses Redis with a TTL to ensure expiration and single-use.
 * @param {string} contact - Normalized contact (e.g., +92XXXXXXXXXX or email).
 * @param {string} [customOtp] - Optional custom OTP value.
 * @returns {Promise<string>} The OTP stored.
 */
async function upsertOtp(contact, customOtp) {
  const otp = customOtp || generateOtp();
  const key = `otp:${contact}`;
  try {
    await redisClient.set(key, otp, { EX: REDIS_OTP_TTL });
    console.log(`[OTP] Stored OTP for ${contact} with TTL ${REDIS_OTP_TTL}s`);
  } catch (err) {
    console.error('[OTP] Error storing OTP in Redis, using fallback store:', err);
    // Simple in‑memory fallback (process‑wide)
    if (!global.__fallbackOtpStore) global.__fallbackOtpStore = {};
    global.__fallbackOtpStore[key] = { otp, expiresAt: Date.now() + REDIS_OTP_TTL * 1000 };
  }
  return otp;
}

/**
 * Verify the OTP for a given contact.
 * Returns true if valid and not expired; also removes it after successful verification.
 * @param {string} contact - Normalized contact used as Redis key.
 * @param {string} otp - OTP supplied by client.
 * @returns {Promise<boolean>} Verification result.
 */
async function verifyOtp(contact, otp) {
  const key = `otp:${contact}`;
  try {
    const stored = await redisClient.get(key);
    if (!stored) {
      // No OTP found (may be expired or never generated)
      console.log(`[OTP] No OTP found for ${contact}`);
      return false;
    }
    if (stored !== otp) {
      console.log(`[OTP] Mismatch for ${contact}: expected ${stored}, received ${otp}`);
      return false;
    }
    // OTP matches – consume it
    await redisClient.del(key);
    console.log(`[OTP] Verified and consumed OTP for ${contact}`);
    return true;
  } catch (err) {
    console.error('[OTP] Error verifying OTP in Redis:', err);
    return false;
  }
}

function getOtp(contact) {
  const key = `otp:${contact}`;
  try {
    return redisClient.get(key);
  } catch (err) {
    // Fallback to in‑memory store if Redis unavailable
    if (global.__fallbackOtpStore && global.__fallbackOtpStore[key]) {
      const entry = global.__fallbackOtpStore[key];
      if (Date.now() < entry.expiresAt) return Promise.resolve(entry.otp);
      // expired – clean up
      delete global.__fallbackOtpStore[key];
    }
    return Promise.resolve(null);
  }
}

async function consumeOtp(contact) {
  const key = `otp:${contact}`;
  try {
    await redisClient.del(key);
  } catch (err) {
    // Remove from fallback store if present
    if (global.__fallbackOtpStore && global.__fallbackOtpStore[key]) {
      delete global.__fallbackOtpStore[key];
    }
  }
}

module.exports = {
  generateOtp,
  upsertOtp,
  verifyOtp,
  getOtp,
  consumeOtp,
};