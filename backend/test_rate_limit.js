const fetch = require('node-fetch');

async function testRateLimit() {
  const url = 'http://localhost:5001/api/auth/login';
  console.log('Starting rate limit test (12 attempts)...');
  
  for (let i = 1; i <= 12; i++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password', captchaToken: 'dummy' })
      });
      const data = await res.json();
      console.log(`Attempt ${i}: Status ${res.status} - ${data.message}`);
      if (res.status === 429) {
        console.log('SUCCESS: Rate limit triggered at attempt ' + i);
        return;
      }
    } catch (err) {
      console.log(`Attempt ${i}: Failed to connect. Is server running?`);
      return;
    }
  }
}

testRateLimit();
