// Determine base API URL:
// 1. Uses VITE_API_URL if defined (from environment variables or .env files)
// 2. In production (e.g. Render build), defaults to the live Render backend
// 3. In local development, defaults to localhost:5000/api
const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://blogsphere-qnvt.onrender.com/api'
    : 'http://localhost:5000/api');

// Normalize API_URL so it reliably ends with '/api' and has no trailing slash
const cleanBase = rawApiUrl.replace(/\/+$/, '');
const API_URL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('blogsphere_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Something went wrong');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status === 401) {
      // If unauthorized, token may be invalid/expired
      // Only remove if it was an authenticated request
      if (token) {
        localStorage.removeItem('blogsphere_token');
        localStorage.removeItem('blogsphere_user');
      }
    }
    throw error;
  }
};

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' })
};

export default api;
