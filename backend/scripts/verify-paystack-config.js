const fetch = require('node-fetch');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (SECRET_KEY) {
  console.log(`Using Key: ${SECRET_KEY.substring(0, 7)}...${SECRET_KEY.substring(SECRET_KEY.length - 4)}`);
} else {
  console.log('No PAYSTACK_SECRET_KEY found in process.env');
}

async function testPaystackRegion(region, currency, amount) {
  console.log(`\n--- TESTING REGION: ${region} (${currency}) ---`);
  
  const payload = {
    email: 'test@234deals.com',
    amount: amount,
    currency: currency,
    reference: `test_ref_${Date.now()}_${region}`,
    callback_url: 'https://234deals.vercel.app/pricing',
    metadata: {
        userId: 999,
        planId: 'basic',
        country: region
    }
  };

  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.status) {
      console.log(`✅ Success for ${region}:`, data.data.authorization_url);
    } else {
      console.error(`❌ Failed for ${region}:`, data.message);
    }
  } catch (err) {
    console.error(`💥 Error for ${region}:`, err.message);
  }
}

async function runTests() {
  if (!SECRET_KEY || SECRET_KEY.includes('your_secret_key')) {
    console.error('❌ PAYSTACK_SECRET_KEY is not configured correctly in .env');
    process.exit(1);
  }

  await testPaystackRegion('Nigeria', 'NGN', 100000); // 1000 NGN
  await testPaystackRegion('China', 'USD', 1000);   // 10 USD
}

runTests();
