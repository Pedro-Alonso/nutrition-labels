import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { logApiError, logRequest, logResponse } from '@/lib/logger';
import { storage } from '@/services/storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Refresh queue ────────────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token!);
  });
  failedQueue = [];
}

// ─── Request interceptor — inject Bearer token ────────────────────────────────

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await storage.getAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  logRequest(config);
  return config;
});

// ─── Response interceptor — handle 401 + refresh ─────────────────────────────

apiClient.interceptors.response.use(
  (response) => {
    logResponse(response);
    return response;
  },
  async (error: AxiosError) => {
    logApiError(error);
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Avoid refresh loop on the refresh endpoint itself
    if (originalRequest.url?.includes('/auth/refresh')) {
      await storage.clearTokens();
      router.replace('/(auth)/login');
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.set('Authorization', `Bearer ${token}`);
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await storage.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post<{ access_token: string; token_type: string }>(
        `${BASE_URL}/auth/refresh`,
        { refresh_token: refreshToken },
      );

      await storage.setAccessToken(data.access_token);
      processQueue(null, data.access_token);
      originalRequest.headers.set('Authorization', `Bearer ${data.access_token}`);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      await storage.clearTokens();
      router.replace('/(auth)/login');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
