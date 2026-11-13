import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import {
  AUTH_TOKEN_CHANGE_EVENT,
  clearStoredAuthTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAuthTokens,
} from '@/lib/auth/tokens';

const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10_000,
});

// Shared in-flight promise for token refresh to avoid concurrent duplicate requests
let refreshPromise: Promise<string | null> | null = null;

async function executeRefreshToken(): Promise<string | null> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    // Use an un-intercepted axios call to prevent infinite interceptor loops
    const response = await axios.post<{
      accessToken: string;
      refreshToken: string;
      user: { id: string; email: string; role: string };
    }>(
      `${baseURL}/auth/refresh`,
      { refreshToken },
      { timeout: 10_000 },
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    if (accessToken && newRefreshToken) {
      setStoredAuthTokens(accessToken, newRefreshToken);
      return accessToken;
    }
    return null;
  } catch (error) {
    clearStoredAuthTokens();
    if (
      typeof window !== 'undefined' &&
      window.location.pathname.startsWith('/admin') &&
      window.location.pathname !== '/admin/login'
    ) {
      window.location.href = '/admin/login';
    }
    return null;
  }
}

// Attach access token to outgoing requests
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = getStoredAccessToken();
    const isAuthEndpoint =
      config.url?.includes('/auth/login') ||
      config.url?.includes('/auth/refresh');

    if (token && !isAuthEndpoint) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Intercept 401 responses and automatically refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    const is401 = error.response?.status === 401;
    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/logout');

    if (is401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      const currentRefreshToken = getStoredRefreshToken();

      // If no refresh token exists, handle logout redirect if in admin
      if (!currentRefreshToken) {
        if (
          typeof window !== 'undefined' &&
          window.location.pathname.startsWith('/admin') &&
          window.location.pathname !== '/admin/login'
        ) {
          clearStoredAuthTokens();
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = executeRefreshToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

