const Dysmsapi = require('@alicloud/dysmsapi20170525');
const OpenApi = require('@alicloud/openapi-client');

/**
 * Initialize the Alibaba Cloud SMS Client securely
 */
const createClient = () => {
  const config = new OpenApi.Config({
    accessKeyId: process.env.ALIBABA_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIBABA_ACCESS_KEY_SECRET,
  });
  
  // Use dysmsapi endpoint (default Global/Domestic node)
  config.endpoint = "dysmsapi.aliyuncs.com";
  
  return new Dysmsapi.default(config);
}

/**
 * Send OTP via Alibaba Cloud SMS
 * @param {string} phone - Target phone number in E.164 (e.g. +86138...)
 * @param {string} otpValue - The dynamically generated OTP code
 */
const sendAlibabaOtp = async (phone, otpValue) => {
  try {
    const client = createClient();
    
    // Strip the plus sign if it exists (Alibaba natively prefers pure numerical strings)
    const safePhone = typeof phone === 'string' ? phone.replace(/^\+/, '') : phone;

    const request = new Dysmsapi.SendSmsRequest({
      phoneNumbers: safePhone,
      signName: process.env.ALIBABA_SMS_SIGN_NAME || "92Dealz",
      templateCode: process.env.ALIBABA_SMS_TEMPLATE_CODE || "SMS_0000000",
      templateParam: JSON.stringify({ code: otpValue.toString() }), // Safely ensuring it acts as a variable map
    });

    const response = await client.sendSms(request);
    
    // Alibaba returns response.body.code === 'OK' on perfect success
    if (response && response.body && response.body.code === 'OK') {
        return { success: true, messageId: response.body.bizId };
    } else {
        console.error('[ALIBABA_SMS] Gateway Rejection:', response.body);
        return { success: false, message: response.body?.message || 'Alibaba API rejected request' };
    }
  } catch (err) {
    console.error('[ALIBABA_SMS] Execution Exception:', err.message);
    return { success: false, message: err.message };
  }
};

module.exports = {
  sendAlibabaOtp
};
