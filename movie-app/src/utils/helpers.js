/**
 * Truncates text to a specified length and appends an ellipsis.
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Gets query parameters from a URL search string.
 */
export function getQueryParam(searchString, paramName) {
  const params = new URLSearchParams(searchString);
  return params.get(paramName);
}

/**
 * Generates a random rating for mock purposes.
 */
export function generateRandomRating() {
  return (Math.random() * (10 - 7) + 7).toFixed(1);
}
