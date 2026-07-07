// Base API client utility

export async function request(endpoint, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const url = `${baseUrl}${endpoint}`;

  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'API request failed');
    }
    return await response.json();
  } catch (error) {
    console.error(`API request error on ${endpoint}:`, error);
    throw error;
  }
}
