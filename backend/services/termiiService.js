const fetch = require('node-fetch');
const TERMII_API_KEY = process.env.TERMII_API_KEY;
const BASE_URL = 'https://api.ng.termii.com/api';

exports.sendTermiiOtp = async (phone) => {
  // Development mode: generate mock OTP and log
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
    console.log(`\n========================================`);
    console.log(`DEV OTP FOR TESTING`);
    console.log(`Phone: ${phone}`);
    console.log(`OTP: ${mockOtp}`);
    console.log(`========================================\n`);
    return { success: true, pinId: `MOCK_${mockOtp}` };
  }
  if (!TERMII_API_KEY) throw new Error('Termii API Key is not configured.');

  let senderId = process.env.TERMII_SENDER_ID;
  if (!senderId || senderId === 'YOUR_SENDER_ID') {
    senderId = 'N-Alert';
  }
  
  const payload = {
    api_key: TERMII_API_KEY,
    message_type: 'NUMERIC',
    pin_type: 'NUMERIC',
    to: phone.startsWith('+') ? phone.substring(1) : phone,
    from: senderId,
    channel: 'dnd',
    pin_attempts: 10,
    pin_time_to_live: 5,
    pin_length: 6,
    pin_placeholder: '< 123456 >',
    message_text: 'Your 92Dealz verification pin is < 123456 >. It expires in 5 minutes. Do not share this code with anyone.',
  };

  try {
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
    
    return { success: true, pinId: data.pinId };
  } catch (error) {
    console.error('[TermiiSendException] Failed to send SMS via Termii:', error.message);
        // In local development or as fallback, return a mock OTP so the user is not blocked
      if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        const mockOtp = String(Math.floor(100000 + Math.random() * 900000));
        console.log(`\n==================================================`);
        console.log(`📱 [DEV OTP FOR TESTING]`);
        console.log(`Phone: ${phone}`);
        console.log(`OTP: ${mockOtp}`);
        console.log(`==================================================\n`);
        return { success: true, pinId: `MOCK_${mockOtp}` };
      }    
    throw error;
  }
};


exports.verifyTermiiOtp = async (pinId, pin) => {
  if (pinId && pinId.startsWith('MOCK_')) {
    const expectedPin = pinId.split('_')[1];
    if (String(pin) === String(expectedPin)) {
      return { verified: "True" };
    }
    return { verified: "False" };
  }

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

