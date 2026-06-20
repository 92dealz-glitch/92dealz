require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { sendMail } = require('../services/emailService');

const to = process.argv[2] || 'test@example.com';

(async () => {
  try {
    await sendMail({
      to,
      subject: 'Test Email from 92Dealz',
      text: 'If you receive this, Gmail SMTP is working.',
      html: '<p>If you receive this, Gmail SMTP is working.</p>',
    });
    console.log('✅ Test email sent successfully to', to);
  } catch (err) {
    console.error('❌ Failed to send test email:', err.message);
    console.error(err);
    process.exit(1);
  }
})();
