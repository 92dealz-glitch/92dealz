/**
 * Normalizes phone numbers to +234 format for Nigerian numbers
 */
function formatPhone(phoneInput) {
  if (!phoneInput) return phoneInput;
  let clean = phoneInput.replace(/[\s-()]/g, '');
  if (clean.startsWith('0') && clean.length === 11) {
    return '+234' + clean.substring(1);
  }
  if (clean.startsWith('234') && clean.length === 13) {
    return '+' + clean;
  }
  if (!clean.startsWith('+')) {
    if (clean.length === 10) return '+234' + clean;
    return '+' + clean;
  }
  return clean;
}

module.exports = formatPhone;
