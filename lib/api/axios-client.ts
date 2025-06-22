import axios, { AxiosInstance } from 'axios';

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // You can attach tokens or logging here
    // const token = getAuthToken(); if you're using auth
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('API Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
