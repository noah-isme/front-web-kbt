import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { NormalizedError, normalizeError } from './httpError';

const API_BASE_URL = (() => {
  const envUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
})();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void; config: AxiosRequestConfig }[] = [];

const processQueue = (error: NormalizedError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(apiClient(prom.config));
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>): Promise<never> => {
    const originalRequest = error.config;

    // If the error is not 401 or it's already a retried request, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(normalizeError(error));
    }

    // If 401 and not refreshing, attempt to refresh token
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ config: originalRequest, resolve, reject });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        // No refresh token, so just logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        processQueue(normalizeError(error)); // Reject all queued requests
        return Promise.reject(normalizeError(error));
      }

      const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem('access_token', access);

      originalRequest.headers.Authorization = `Bearer ${access}`;
      processQueue(null, access); // Resolve all queued requests with new token
      return apiClient(originalRequest); // Retry the original request
    } catch (refreshError) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      processQueue(normalizeError(refreshError)); // Reject all queued requests
      return Promise.reject(normalizeError(refreshError));
    } finally {
      isRefreshing = false;
    }
  },
);
