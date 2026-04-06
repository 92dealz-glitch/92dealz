const fetch = require('node-fetch');

let cachedRates = null;
let lastFetch = 0;
const CACHE_DURATION = 3600000; // 1 hour

async function getRates() {
  const now = Date.now();
  if (cachedRates && (now - lastFetch < CACHE_DURATION)) {
    return cachedRates;
  }

  try {
    console.log('[CurrencyService] Fetching fresh exchange rates...');
    // Using exchangerate-api.com (v4 is free, no key required for basic USD base)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    
    if (data && data.rates) {
      cachedRates = {
        USD: 1,
        NGN: data.rates.NGN || 1600, // Fallback if API fails for specific rate
        CNY: data.rates.CNY || 7.2
      };
      lastFetch = now;
      console.log('[CurrencyService] Rates updated:', cachedRates);
      return cachedRates;
    }
    throw new Error('Invalid API response');
  } catch (err) {
    console.error('[CurrencyService] Rate fetch failed:', err.message);
    if (cachedRates) return cachedRates; // Return stale if available
    // Solid fallbacks for first run failure
    return { USD: 1, NGN: 1600, CNY: 7.2 };
  }
}

/**
 * Converts an amount from a source currency to the platform's base currency (NGN)
 */
async function convertToBase(amount, fromCurrency) {
  const rates = await getRates();
  const src = fromCurrency.toUpperCase();
  if (src === 'NGN') return amount;
  
  // Logic: Amount / Rate_Source * Rate_NGN
  // e.g. 10 USD -> 10 / 1 * 1600 = 16000 NGN
  // e.g. 100 CNY -> 100 / 7.2 * 1600 = 22222 NGN
  const usdValue = amount / (rates[src] || 1);
  return usdValue * rates.NGN;
}

/**
 * Converts an amount from base (NGN) to any target currency
 */
async function convertFromBase(amountNgn, toCurrency) {
  const rates = await getRates();
  const target = toCurrency.toUpperCase();
  if (target === 'NGN') return amountNgn;

  const usdValue = amountNgn / rates.NGN;
  return usdValue * (rates[target] || 1);
}

module.exports = {
  getRates,
  convertToBase,
  convertFromBase
};
