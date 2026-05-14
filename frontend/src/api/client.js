import axios from 'axios';
import { store } from '../features/store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Create axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add auth token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor to handle errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    return Promise.reject(error.response?.data || error.message);
  },
);

export default apiClient;
