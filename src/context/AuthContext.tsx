import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Import useTranslation

import { loginRequest } from '../api/auth';
import { apiClient } from '../api/client';
import { normalizeError } from '../api/httpError';
import { ApiResponse, AuthResponse, LoginPayload, User } from '../types';
import { decodeJwt } from '../utils/jwt';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Clock skew tolerance in seconds (e.g., 5 minutes before actual expiry)
const CLOCK_SKEW_TOLERANCE = 5 * 60; 
// Idle timeout in milliseconds (e.g., 30 minutes)
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; 

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState<number | null>(null); // Unix timestamp
  const [isLoading, setIsLoading] = useState(true);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      if (accessToken) { // Only auto-logout if currently authenticated
        toast.error(t('logout_inactive'));
        logout();
      }
    }, IDLE_TIMEOUT_MS);
  }, [accessToken, t]);

  const persistAuth = useCallback(
    (access: string | null, refresh: string | null, expiresAt: number | null) => {
      if (typeof window === 'undefined') {
        return;
      }
      if (access && refresh && expiresAt) {
        window.localStorage.setItem('access_token', access);
        window.localStorage.setItem('refresh_token', refresh);
        window.localStorage.setItem('access_token_expires_at', String(expiresAt));
      } else {
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('refresh_token');
        window.localStorage.removeItem('access_token_expires_at');
      }
    },
    [],
  );

  const refreshAccessToken = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem('refresh_token');
    if (!currentRefreshToken) {
      console.log('No refresh token found, logging out.');
      logout();
      return;
    }

    try {
      const response = await axios.post(`${apiClient.defaults.baseURL}/auth/token/refresh/`, {
        refresh: currentRefreshToken,
      });
      const { access } = response.data;
      const decodedAccess = decodeJwt(access);
      const newExpiresAt = decodedAccess?.exp ? decodedAccess.exp : null;

      setAccessToken(access);
      setAccessTokenExpiresAt(newExpiresAt);
      persistAuth(access, currentRefreshToken, newExpiresAt);
      console.log('Access token refreshed successfully.');
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      logout();
    }
  }, [persistAuth, logout]);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setAccessTokenExpiresAt(null);
    persistAuth(null, null, null);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    // Redirect to login page after logout
    window.location.href = '/login';
  }, [persistAuth]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setIsLoading(true);
      try {
        const response: ApiResponse<AuthResponse> = await loginRequest(payload);
        if (response.error) {
          throw new Error(response.error);
        }
        const { access, refresh, user: loggedInUser } = response.data;

        const decodedAccess = decodeJwt(access);
        const expiresAt = decodedAccess?.exp ? decodedAccess.exp : null;

        setUser(loggedInUser);
        setAccessToken(access);
        setRefreshToken(refresh);
        setAccessTokenExpiresAt(expiresAt);
        persistAuth(access, refresh, expiresAt);
        toast.success(response.message ?? t('login_success'));
        resetIdleTimer(); // Start idle timer on successful login
      } catch (error) {
        const message = normalizeError(error).message;
        toast.error(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [persistAuth, resetIdleTimer, t],
  );

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    const storedExpiresAt = localStorage.getItem('access_token_expires_at');

    if (storedAccessToken && storedRefreshToken && storedExpiresAt) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      setAccessTokenExpiresAt(Number(storedExpiresAt));
      resetIdleTimer(); // Start idle timer if already logged in
    }
    setIsLoading(false);

    // Event listeners for user activity
    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    activityEvents.forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [resetIdleTimer]);

  // Effect for proactive token refresh
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    if (accessToken && accessTokenExpiresAt) {
      const expiresInMs = (accessTokenExpiresAt * 1000) - Date.now();
      const refreshThresholdMs = CLOCK_SKEW_TOLERANCE * 1000; // e.g., 5 minutes before expiry

      if (expiresInMs > refreshThresholdMs) {
        // Schedule refresh before expiry
        refreshInterval = setTimeout(() => {
          refreshAccessToken();
        }, expiresInMs - refreshThresholdMs);
      } else if (expiresInMs > 0) {
        // Token is about to expire or already expired, try to refresh immediately
        refreshAccessToken();
      } else {
        // Token already expired, logout
        logout();
      }
    }

    return () => {
      if (refreshInterval) {
        clearTimeout(refreshInterval);
      }
    };
  }, [accessToken, accessTokenExpiresAt, refreshAccessToken, logout]);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken),
      isLoading,
      login,
      logout,
    }),
    [accessToken, isLoading, login, logout, refreshToken, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

