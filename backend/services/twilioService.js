const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

exports.sendTwilioOtp = async (phone) => {
  if (!client) throw new Error('Twilio is not configured properly.');
  return await client.verify.v2.services(serviceSid)
    .verifications
    .create({ to: phone, channel: 'sms' });
};

exports.verifyTwilioOtp = async (phone, code) => {
  if (!client) throw new Error('Twilio is not configured properly.');
  return await client.verify.v2.services(serviceSid)
    .verificationChecks
    .create({ to: phone, code });
};
