const client = require('../config/redisClient');

(async () => {
  try {
    const keys = await client.keys('otp:*');
    if (!keys || keys.length === 0) {
      console.log('NO OTP KEYS FOUND');
      return;
    }
    for (const key of keys) {
      const val = await client.get(key);
      console.log(`${key} => ${val}`);
    }
  } catch (err) {
    console.error('Error accessing Redis:', err);
    // Fallback to in‑memory store if present
    if (global.__fallbackOtpStore) {
      console.log('--- Fallback in‑memory OTP store ---');
      for (const [k, entry] of Object.entries(global.__fallbackOtpStore)) {
        console.log(`${k} => ${entry.otp} (expires at ${new Date(entry.expiresAt).toISOString()})`);
      }
    }
  }
})();
