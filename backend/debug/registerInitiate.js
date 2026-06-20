(async () => {
  try {
    const res = await fetch('http://localhost:5001/api/auth/register-initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'TestUser',
        contact: '+923001234567',
        password: 'TestPass123',
        method: 'phone',
        captchaToken: 'dummy'
      })
    });
    const data = await res.json();
    console.log('Response:', data);
  } catch (e) {
    console.error('Fetch error:', e);
  }
})();
