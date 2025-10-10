import axios from 'axios';

const baseUrl = (() => {
  const envUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
})();

export const apiClient = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('kbt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kbt_token');
    }
    return Promise.reject(error);
  },
);
