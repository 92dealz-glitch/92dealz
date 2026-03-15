const PasswordReset = require('../models/PasswordReset');

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function ensureTable() {}

async function upsertOtp(userId, otp, minutes = 10) {
  const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
  await PasswordReset.destroy({ where: { user_id: userId } });
  await PasswordReset.create({ user_id: userId, otp, expires_at: expiresAt });
  return { otp, expiresAt };
}

async function verifyOtp(userId, otp) {
  const record = await PasswordReset.findOne({
    where: { user_id: userId, otp },
  });
  if (!record) return false;
  return record.expires_at > new Date();
}

async function clearOtp(userId) {
  await PasswordReset.destroy({ where: { user_id: userId } });
}

module.exports = { generateOtp, upsertOtp, verifyOtp, clearOtp };
