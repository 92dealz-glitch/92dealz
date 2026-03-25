const verifyRecaptcha = async (token) => {
  if (!token) {
    console.warn('reCAPTCHA token is missing');
    return false;
  }

  let secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (secretKey) {
    secretKey = secretKey.replace(/\s/g, '');
  }

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not defined in environment variables');
    // In development, you might want to skip this or allow it
    return true; 
  }

  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`, {
      method: 'POST',
    });

    const data = await response.json();
    if (!data.success) {
      console.error('[RECAPTCHA_ERROR]', data['error-codes']);
    }
    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
};

module.exports = verifyRecaptcha;
