const geoip = require('geoip-lite');
const { parsePhoneNumber } = require('libphonenumber-js');

/**
 * Helper to get country from request IP or headers
 */
const getCountryFromRequest = (req) => {
  // Check headers first (common for Vercel/Cloudflare)
  const headerCountry = req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'];
  if (headerCountry) {
    try {
      const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return {
        code: headerCountry.toUpperCase(),
        name: displayNames.of(headerCountry.toUpperCase())
      };
    } catch (e) {
      return { code: headerCountry.toUpperCase(), name: null };
    }
  }

  // Fallback to geoip-lite
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const geo = geoip.lookup(ip);
  if (geo && geo.country) {
    try {
      const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return {
        code: geo.country,
        name: displayNames.of(geo.country)
      };
    } catch (e) {
      return { code: geo.country, name: null };
    }
  }

  return { code: null, name: null };
};

/**
 * Helper to get country from phone number
 */
const getCountryFromPhone = (phone) => {
  if (!phone) return { code: null, name: null };
  try {
    const phoneNumber = parsePhoneNumber(phone);
    if (phoneNumber && phoneNumber.country) {
      const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });
      return {
        code: phoneNumber.country,
        name: displayNames.of(phoneNumber.country)
      };
    }
  } catch (e) {}
  return { code: null, name: null };
};

module.exports = {
  getCountryFromRequest,
  getCountryFromPhone
};
