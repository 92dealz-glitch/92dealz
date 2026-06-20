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
        PKR: data.rates.PKR || 280, // Fallback if API fails for specific rate
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
    return { USD: 1, PKR: 280, CNY: 7.2 };
  }
}

/**
 * Converts an amount from a source currency to the platform's base currency (PKR)
 */
async function convertToBase(amount, fromCurrency) {
  const rates = await getRates();
  const src = fromCurrency.toUpperCase();
  if (src === 'PKR') return amount;
  
  // Logic: Amount / Rate_Source * Rate_PKR
  // e.g. 10 USD -> 10 / 1 * 280 = 2800 PKR
  // e.g. 100 CNY -> 100 / 7.2 * 280 = 3888 PKR
  const usdValue = amount / (rates[src] || 1);
  return usdValue * rates.PKR;
}

/**
 * Converts an amount from base (PKR) to any target currency
 */
async function convertFromBase(amountPkr, toCurrency) {
  const rates = await getRates();
  const target = toCurrency.toUpperCase();
  if (target === 'PKR') return amountPkr;

  const usdValue = amountPkr / rates.PKR;
  return usdValue * (rates[target] || 1);
}

module.exports = {
  getRates,
  convertToBase,
  convertFromBase
};
