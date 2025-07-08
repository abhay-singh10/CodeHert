import axios from 'axios';

// Create axios instance with base configuration
const instance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only redirect to /login for 401 errors from protected endpoints (not /user/me)
    const protectedEndpoints = ['/auth/logout'];
    const requestUrl = error.config?.url || '';
    if (
      error.response?.status === 401 &&
      protectedEndpoints.some(endpoint => requestUrl.includes(endpoint)) &&
      !['/login', '/register', '/'].includes(window.location.pathname)
    ) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance; 