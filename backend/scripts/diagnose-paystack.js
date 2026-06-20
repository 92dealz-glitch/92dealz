const fetch = require('node-fetch');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

async function checkKey() {
  console.log(`Checking Secret Key: ${SECRET_KEY ? SECRET_KEY.substring(0, 10) + '...' : 'MISSING'}`);
  
  try {
    const response = await fetch('https://api.paystack.co/balance', {
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`
      }
    });
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.status) {
        console.log('✅ Key is ACTIVE and VALID.');
    } else {
        console.error('❌ Paystack Error:', data.message);
        if (data.message === 'Invalid key') {
            console.log('\n--- RECOMMENDATION ---');
            console.log('1. Check if your Paystack dashboard is in "Test Mode". If it is, use pk_test/sk_test keys.');
            console.log('2. If you are using Live keys, ensure your business is "Live" and not "Pending Activation".');
            console.log('3. Ensure no trailing spaces exist (currently checked and none found).');
        }
    }
  } catch (err) {
    console.error('Network Error:', err.message);
  }
}

checkKey();
