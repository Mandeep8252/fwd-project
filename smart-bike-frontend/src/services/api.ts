import axios from 'axios';

// Backend URL
const API_URL = 'http://localhost:5000'; // replace with your backend URL if different

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach JWT token to headers
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // get token from localStorage
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
