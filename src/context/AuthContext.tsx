import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { loginRequest } from '../api/auth';
import { ApiResponse, AuthResponse, LoginPayload, User } from '../types';

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Set to true initially to indicate loading auth state

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');

    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      // Optionally, fetch user profile here if needed
      // For now, we'll assume user info comes with login or is not critical for initial auth state
    }
    setIsLoading(false);
  }, []);

  const persistAuth = useCallback((access: string | null, refresh: string | null) => {
    if (typeof window === 'undefined') {
      return;
    }
    if (access && refresh) {
      window.localStorage.setItem('access_token', access);
      window.localStorage.setItem('refresh_token', refresh);
    } else {
      window.localStorage.removeItem('access_token');
      window.localStorage.removeItem('refresh_token');
    }
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setIsLoading(true);
      try {
        const response: ApiResponse<AuthResponse> = await loginRequest(payload);
        if (response.error) {
          throw new Error(response.error);
        }
        const { access, refresh, user: loggedInUser } = response.data;
        setUser(loggedInUser);
        setAccessToken(access);
        setRefreshToken(refresh);
        persistAuth(access, refresh);
        toast.success(response.message ?? 'Successfully logged in');
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to login. Please try again later.';
        toast.error(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [persistAuth],
  );

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    persistAuth(null, null);
  }, [persistAuth]);

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

