import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

api.interceptors.request.use(
  (config) => {
    // Check both cookie and localStorage (with safety check for SSR)
    const token = Cookies.get('token') || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('Network Error - Check if backend is running and CORS is configured correctly');
      console.error('Current API URL:', API_URL);
    }
    return Promise.reject(error);
  }
);

export default api;
