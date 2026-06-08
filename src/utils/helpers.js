/**
 * Utility helper functions for the Aurora Goods application.
 */

/**
 * Formats a numeric price into the Indian Rupee currency format (e.g. ₹4,999).
 * @param {number} amount - The numeric amount to format.
 * @returns {string} The formatted currency string.
 */
export function formatCurrency(amount) {
  if (amount == null) return "";
  return `₹${amount.toLocaleString("en-IN")}`;
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
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Safely retrieves and parses an item from localStorage.
 * @param {string} key - The localStorage key.
 * @param {*} defaultValue - The default value if key is not found or parsing fails.
 * @returns {*} The parsed item or default value.
 */
export function getStorageItem(key, defaultValue) {
  if (typeof window === "undefined") return defaultValue;
  try {
    const value = window.localStorage.getItem(key);
    if (value === null) return defaultValue;

    // Only parse if it looks like a serialized JSON object, array, boolean, or null
    const trimmed = value.trim();
    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      trimmed === "true" ||
      trimmed === "false" ||
      trimmed === "null"
    ) {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Safely serializes and saves an item to localStorage.
 * @param {string} key - The localStorage key.
 * @param {*} value - The value to save.
 */
export function setStorageItem(key, value) {
  if (typeof window === "undefined") return;
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
    } else if (typeof value === "string") {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
  }
}

/**
 * Safely removes an item from localStorage.
 * @param {string} key - The localStorage key.
 */
export function removeStorageItem(key) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}
