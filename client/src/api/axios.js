import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: API_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Axios interceptor - Token from localStorage:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Authorization header set:', config.headers.Authorization.substring(0, 30) + '...');
  } else {
    console.warn('No token in localStorage!');
  }
  
  // Remove Content-Type for FormData - let the browser set it with boundary
  if (config.data instanceof FormData) {
    console.log('FormData detected, removing Content-Type header');
    delete config.headers['Content-Type'];
  } else {
    // For JSON requests, ensure Content-Type is set
    config.headers['Content-Type'] = 'application/json';
  }
  
  console.log('Final headers:', Object.keys(config.headers));
  return config;
});

export default instance;
