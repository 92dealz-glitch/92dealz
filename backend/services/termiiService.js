const fetch = require('node-fetch');
const TERMII_API_KEY = process.env.TERMII_API_KEY;
const BASE_URL = 'https://api.ng.termii.com/api';

exports.sendTermiiOtp = async (phone) => {
  if (!TERMII_API_KEY) throw new Error('Termii API Key is not configured.');
  
  const payload = {
    api_key: TERMII_API_KEY,
    message_type: 'NUMERIC',
    pin_type: 'NUMERIC',
    to: phone,
    from: 'N-Alert',
    channel: 'dnd',
    pin_attempts: 10,
    pin_time_to_live: 5,
    pin_length: 6,
    pin_placeholder: '< 123456 >',
    message_text: 'Your 234Deals verification pin is < 123456 >. It expires in 5 minutes. Do not share this code with anyone.',
  };

  const res = await fetch(`${BASE_URL}/sms/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const data = await res.json();
  if (!res.ok) {
    console.error(`[TermiiError] ${res.status}:`, data);
    throw new Error(data.message || `HTTP ${res.status} from Termii API`);
  }
  
  // Normalize pinId/pin_id to pinId
  if (!data.pinId && data.pin_id) {
    data.pinId = data.pin_id;
  }
  
  return data; // Guaranteed { pinId: '...' } if successful
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
