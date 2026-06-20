async function testTermii() {
  const TERMII_API_KEY = "TLsEPCbixTNpCCEOWiYOcvZsFONCIIxrOKhMwvFydvKYSKbceRutdgyHtjWFVe";
  const payload = {
    api_key: TERMII_API_KEY,
    message_type: 'NUMERIC',
    pin_type: 'NUMERIC',
    to: "2348109077743", 
    from: 'N-Alert', 
    channel: 'dnd',
    pin_attempts: 10,
    pin_time_to_live: 5,
    pin_length: 6,
    pin_placeholder: '< 123456 >',
    message_text: 'Your 92Dealz verification pin is < 123456 >. It expires in 5 minutes. Do not share this code with anyone.'
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
