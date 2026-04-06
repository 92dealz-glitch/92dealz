const currencyService = require('../services/currencyService');
const geoip = require('geoip-lite');

exports.getRates = async (req, res, next) => {
  try {
    const rates = await currencyService.getRates();
    return res.json({ success: true, rates });
  } catch (err) {
    return next(err);
  }
};

exports.detectLocation = async (req, res, next) => {
  try {
    // Determine user IP
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    
    // geoip-lite check
    const geo = geoip.lookup(ip);
    
    let currency = 'USD';
    let country = 'US';
    
    if (geo) {
      country = geo.country;
      if (country === 'NG') currency = 'NGN';
      else if (country === 'CN') currency = 'CNY';
    }

    return res.json({
      success: true,
      currency,
      country,
      ip
    });
  } catch (err) {
    console.error('[CurrencyController] Detect failed:', err.message);
    return res.json({ success: true, currency: 'USD' }); // Fail gracefully
  }
};
