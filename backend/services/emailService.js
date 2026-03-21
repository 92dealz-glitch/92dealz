const nodemailer = require('nodemailer');

async function getTransport() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!host) {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }

  // Common service shortcuts
  const options = {
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  };

  if (host.includes('gmail.com')) {
    return nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  }

  return nodemailer.createTransport(options);
}

async function sendSignupOtp(toEmail, otp) {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const from = process.env.EMAIL_FROM || process.env.FROM_EMAIL || `"234Deals" <${user || 'no-reply@234deals.com'}>`;
  const transport = await getTransport();
  const subject = `${otp} is your 234Deals verification code`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 8px;">
      <h2 style="color: #f97316;">Welcome to 234Deals!</h2>
      <p style="font-size: 16px; color: #333;">To complete your registration, please enter the following verification code:</p>
      <div style="background-color: #fff7ed; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #f97316;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #666;">This code will expire in <strong>10 minutes</strong>.</p>
      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
      <p style="font-size: 12px; color: #999;">If you didn't request this code, you can safely ignore this email.</p>
      <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} 234Deals Marketplace</p>
    </div>
  `;

  const info = await transport.sendMail({ 
    from, 
    to: toEmail, 
    subject, 
    html,
    text: `Your 234Deals verification code is: ${otp}. It expires in 10 minutes.`,
    replyTo: '234dealss@gmail.com'
  });
  console.log('Signup OTP sent. MessageID:', info.messageId);
}

async function sendResetOtp(toEmail, otp) {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const from = process.env.FROM_EMAIL || process.env.EMAIL_FROM || user || 'no-reply@example.com';
  const transport = await getTransport();
  const subject = 'Password Reset OTP';
  const text = `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`;
  const info = await transport.sendMail({ from, to: toEmail, subject, text });
  const url = nodemailer.getTestMessageUrl(info);
  if (url) {
    console.log('[mail:preview]', url);
  }
}

async function sendGeneric(toEmail, subject, text) {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const from = process.env.FROM_EMAIL || process.env.EMAIL_FROM || user || 'no-reply@example.com';
  const transport = await getTransport();
  const info = await transport.sendMail({ from, to: toEmail, subject, text });
  const url = nodemailer.getTestMessageUrl(info);
  if (url) {
    console.log('[mail:preview]', url);
  }
}

module.exports = { sendResetOtp, sendGeneric, sendSignupOtp };
