async function testTermii() {
  const TERMII_API_KEY = "TLsEPCbixTNpCCEOWiYOcvZsFONCIIxrOKhMwvFydvKYSKbceRutdgyHtjWFVe";
  const payload = {
    api_key: TERMII_API_KEY,
    message_type: 'NUMERIC',
    pin_type: 'NUMERIC',
    to: "2348109077743", 
    from: 'Termii', 
    channel: 'generic',
    pin_attempts: 10,
    pin_time_to_live: 10,
    pin_length: 6,
    pin_placeholder: '< 1234 >',
    message_text: 'Your verification pin is < 1234 >'
  };

  try {
    const res = await fetch(`https://api.ng.termii.com/api/sms/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log("Termii Send Response status:", res.status);
    console.log("Termii Send Response body:", text);
  } catch (e) {
    console.error("Termii Error:", e);
  }
}

testTermii();
