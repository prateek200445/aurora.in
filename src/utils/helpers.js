/**
 * Utility helper functions for the Aurora Goods application.
 */

/**
 * Formats a numeric price into the Indian Rupee currency format (e.g. ₹4,999).
 * @param {number} amount - The numeric amount to format.
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(amount) {
  if (amount == null) return '';
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Calculates the discount percentage between an original price and a discounted price.
 * @param {number} price - The original price.
 * @param {number} discountPrice - The discounted price.
 * @returns {number} The rounded discount percentage.
 */
export function calculateDiscountPercentage(price, discountPrice) {
  if (!price || !discountPrice) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

/**
 * Rounds a financial value to two decimal places to avoid IEEE-754 precision issues.
 * @param {number} value - The numeric value to round.
 * @returns {number} The rounded value.
 */
export function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Calculates and formats a future delivery date string.
 * @param {number} [daysAhead=5] - The number of days in the future.
 * @returns {string} The formatted delivery date.
 */
export function getDeliveryDateString(daysAhead = 5) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
