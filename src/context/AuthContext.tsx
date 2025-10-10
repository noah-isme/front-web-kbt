import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { loginRequest } from '../api/auth';
import { AuthResponse, LoginPayload, User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const storageKey = 'kbt_auth';
const tokenKey = 'kbt_token';

const loadStoredAuth = (): AuthResponse | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      return JSON.parse(stored) as AuthResponse;
    }
  } catch (error) {
    console.error('Failed to parse stored auth state', error);
  }
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const stored = loadStoredAuth();
  const [user, setUser] = useState<User | null>(stored?.user ?? null);
  const [token, setToken] = useState<string | null>(stored?.token ?? null);
  const [isLoading, setIsLoading] = useState(false);

  const persistAuth = useCallback((auth: AuthResponse | null) => {
    if (typeof window === 'undefined') {
      return;
    }
    if (auth) {
      window.localStorage.setItem(storageKey, JSON.stringify(auth));
      window.localStorage.setItem(tokenKey, auth.token);
    } else {
      window.localStorage.removeItem(storageKey);
      window.localStorage.removeItem(tokenKey);
    }
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setIsLoading(true);
      try {
        const response = await loginRequest(payload);
        if (response.error) {
          throw new Error(response.error);
        }
        const auth = response.data;
        setUser(auth.user);
        setToken(auth.token);
        persistAuth(auth);
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
    setToken(null);
    persistAuth(null);
  }, [persistAuth]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
    }),
    [isLoading, login, logout, token, user],
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
