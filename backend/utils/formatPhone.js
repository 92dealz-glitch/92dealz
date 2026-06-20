/**
 * Normalizes phone numbers to +92 format for Pakistani numbers
 */
function formatPhone(phoneInput) {
  if (!phoneInput) return phoneInput;
  let clean = phoneInput.replace(/[\s-()]/g, '');
  if (clean.startsWith('0') && clean.length === 11) {
    return '+92' + clean.substring(1);
  }
  if (clean.startsWith('92') && clean.length === 12) {
    return '+' + clean;
  }
  if (!clean.startsWith('+')) {
    if (clean.length === 10) return '+92' + clean;
    return '+' + clean;
  }
  return clean;
}

module.exports = formatPhone;
