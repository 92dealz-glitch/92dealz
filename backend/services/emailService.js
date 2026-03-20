const nodemailer = require('nodemailer');

async function getTransport() {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const secure = port === 465;
  if (!host) {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined,
  });
}

async function sendSignupOtp(toEmail, otp) {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const from = process.env.EMAIL_FROM || process.env.FROM_EMAIL || `"234Deals" <${user || 'no-reply@234deals.com'}>`;
  const transport = await getTransport();
  const subject = 'Verification Code - 234Deals';
  const text = `Welcome to 234Deals! Your verification code is: ${otp}\nThis code will expire in 10 minutes.`;
  await transport.sendMail({ from, to: toEmail, subject, text });
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
