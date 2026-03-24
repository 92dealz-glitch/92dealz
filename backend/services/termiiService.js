const TERMII_API_KEY = process.env.TERMII_API_KEY;
const BASE_URL = 'https://api.ng.termii.com/api';

exports.sendTermiiOtp = async (phone) => {
  if (!TERMII_API_KEY) throw new Error('Termii API Key is not configured.');
  
  const payload = {
    api_key: TERMII_API_KEY,
    message_type: 'NUMERIC',
    pin_type: 'NUMERIC',
    to: phone,
    from: process.env.TERMII_SENDER_ID || 'N-Alert',
    channel: 'dnd',
    pin_attempts: 10,
    pin_time_to_live: 10,
    pin_length: 6,
    pin_placeholder: '< 1234 >',
    message_text: 'Your 234Deals verification code is < 1234 >. Valid for 10 minutes.',
  };

  const res = await fetch(`${BASE_URL}/sms/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status} from Termii API`);
  }
  return data; // Expected { pinId: '...' }
};

exports.verifyTermiiOtp = async (pinId, pin) => {
  if (!TERMII_API_KEY) throw new Error('Termii API Key is not configured.');

  const payload = {
    api_key: TERMII_API_KEY,
    pin_id: pinId,
    pin: String(pin)
  };

  const res = await fetch(`${BASE_URL}/sms/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status} from Termii API`);
  }
  return data; // Expected { verified: "True" | "False" }
};
