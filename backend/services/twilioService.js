const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_ID;

let client;

if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

/**
 * Sends a verification code via Twilio Verify
 * @param {string} phoneNumber - E.164 formatted phone number
 * @returns {Promise<object>} - Twilio verification response
 */
exports.sendTwilioOtp = async (phoneNumber) => {
  if (!accountSid || !authToken || !verifyServiceSid) {
    const missing = [];
    if (!accountSid) missing.push('TWILIO_ACCOUNT_SID');
    if (!authToken) missing.push('TWILIO_AUTH_TOKEN');
    if (!verifyServiceSid) missing.push('TWILIO_VERIFY_SERVICE_ID');
    throw new Error(`Twilio configuration missing: ${missing.join(', ')}`);
  }

  try {
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phoneNumber, channel: 'sms' });
    
    return verification;
  } catch (error) {
    console.error('Twilio Send Error:', error);
    throw error;
  }
};

/**
 * Checks a verification code via Twilio Verify
 * @param {string} phoneNumber - E.164 formatted phone number
 * @param {string} code - The 6-digit code provided by user
 * @returns {Promise<object>} - Twilio verification check response
 */
exports.verifyTwilioOtp = async (phoneNumber, code) => {
  if (!accountSid || !authToken || !verifyServiceSid) {
    const missing = [];
    if (!accountSid) missing.push('TWILIO_ACCOUNT_SID');
    if (!authToken) missing.push('TWILIO_AUTH_TOKEN');
    if (!verifyServiceSid) missing.push('TWILIO_VERIFY_SERVICE_ID');
    throw new Error(`Twilio configuration missing: ${missing.join(', ')}`);
  }

  try {
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: phoneNumber, code: code });
    
    return verificationCheck;
  } catch (error) {
    console.error('Twilio Verify Error:', error);
    throw error;
  }
};
