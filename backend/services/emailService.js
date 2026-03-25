const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

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

/**
 * Universal mail sender with SendGrid primary and Gmail fallback
 */
async function sendMail(mailOptions) {
  const from = process.env.EMAIL_FROM || `"234Deals" <no-reply@234deals.com>`;
  const replyTo = '234dealss@gmail.com';

  // 1. Try SendGrid
  if (process.env.SENDGRID_API_KEY) {
    try {
      await sgMail.send({
        to: mailOptions.to,
        from: from.includes('<') ? { name: from.split('<')[0].replace(/"/g, '').trim(), email: from.split('<')[1].replace(/>/g, '').trim() } : from,
        subject: mailOptions.subject,
        text: mailOptions.text,
        html: mailOptions.html,
        replyTo,
      });
      console.log(`[Email:SendGrid] Sent to ${mailOptions.to}`);
      return;
    } catch (error) {
      console.error(`[Email:SendGrid] Failed: ${error.message}. Proceeding to fallback.`);
      if (error.response) {
        console.error('[Email:SendGrid:Details]', JSON.stringify(error.response.body));
      }
    }
  }

  // 2. Fallback to Nodemailer/Gmail
  try {
    const transport = await getTransport();
    const info = await transport.sendMail({
      from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      html: mailOptions.html,
      replyTo,
    });
    console.log(`[Email:Fallback] Sent to ${mailOptions.to}. MessageID: ${info.messageId}`);
  } catch (err) {
    console.error(`[Email:CRITICAL] Both primary and fallback failed: ${err.message}`);
    throw err;
  }
}

async function sendSignupOtp(toEmail, otp) {
  const subject = `${otp} is your 234Deals verification code`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #f97316;">Welcome to 234Deals!</h2>
      <p style="font-size: 16px; color: #333 text-align: center;">To complete your registration, please enter the following verification code:</p>
      <div style="background-color: #fff7ed; padding: 25px; text-align: center; border-radius: 12px; margin: 25px 0; border: 1px solid #ffedd5;">
        <span style="font-size: 36px; font-weight: 800; letter-spacing: 6px; color: #ea580c;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #666; text-align: center;">This code will expire in <strong>10 minutes</strong>.</p>
      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;" />
      <p style="font-size: 12px; color: #999; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
      <p style="font-size: 11px; color: #bbb; text-align: center; margin-top: 20px;">&copy; ${new Date().getFullYear()} 234Deals Marketplace. All rights reserved.</p>
    </div>
  `;

  await sendMail({
    to: toEmail,
    subject,
    html,
    text: `Your 234Deals verification code is: ${otp}. It expires in 10 minutes.`,
  });
}

async function sendResetOtp(toEmail, otp) {
  const subject = 'Password Reset OTP - 234Deals';
  const text = `Your OTP for password reset is: ${otp}\nThis OTP will expire in 10 minutes.`;
  await sendMail({
    to: toEmail,
    subject,
    text,
    html: `<h3>Password Reset</h3><p>Your OTP is: <strong>${otp}</strong></p><p>Expires in 10 minutes.</p>`
  });
}

async function sendGeneric(toEmail, subject, text) {
  await sendMail({ to: toEmail, subject, text });
}

module.exports = { sendResetOtp, sendGeneric, sendSignupOtp };
