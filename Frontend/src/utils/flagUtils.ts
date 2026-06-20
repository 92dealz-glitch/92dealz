/**
 * Converts a 2-letter ISO country code into an emoji flag.
 * @param countryCode - 2-letter ISO country code (e.g., 'NG', 'US')
 * @returns The emoji flag or null if invalid.
 */
export const getFlagEmoji = (countryCode: string | null | undefined): string => {
  if (!countryCode || countryCode.length !== 2) return "";
  
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt(0));
    
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return "";
  }
};


