/**
 * Security and Validation Utilities
 * Safeguards input fields from injection and performs format checking.
 */

/**
 * Escapes characters to prevent HTML/XSS injection.
 * @param {string} str - Unsanitized string
 * @returns {string} - Clean, escaped string safe for DOM output
 */
export function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates whether a value is a valid positive number (for budget entries).
 * @param {any} val - The input to validate
 * @returns {boolean} - True if valid, positive number
 */
export function isValidBudget(val) {
  const num = Number(val);
  return !isNaN(num) && num >= 0 && num <= 1000000;
}

/**
 * Sanitizes input length to avoid memory buffer exhaustion or display clutter.
 * @param {string} text - Input text
 * @param {number} maxLen - Maximum allowed characters
 * @returns {string} - Truncated and sanitized string
 */
export function sanitizeWithLimit(text, maxLen = 200) {
  if (!text) return '';
  const trimmed = text.trim();
  const truncated = trimmed.length > maxLen ? trimmed.substring(0, maxLen) : trimmed;
  return sanitize(truncated);
}
