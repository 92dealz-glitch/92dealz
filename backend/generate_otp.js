require('dotenv').config();
const { generateOtp } = require('./services/otpService');

(async () => {
  const otp = generateOtp();
  console.log('Generated OTP:', otp);
})();
