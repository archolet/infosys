'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { apiClient } from '@/lib/api/client';
import { authApi } from '@/lib/api/auth';
import { usersApi } from '@/lib/api/users';
import type { AccessToken, LoginRequest, ApiError } from '@/types/auth';
import type { User } from '@/types/user';

interface AuthContextType {
  // State
  accessToken: AccessToken | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  // Actions
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token expiry check with 1-minute buffer
function isTokenExpired(token: AccessToken): boolean {
  const expiryDate = new Date(token.expirationDate);
  const bufferMs = 60 * 1000; // 1 minute buffer
  return Date.now() >= expiryDate.getTime() - bufferMs;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<AccessToken | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!accessToken && !isTokenExpired(accessToken);

  // Update API client when token changes
  useEffect(() => {
    apiClient.setAccessToken(accessToken?.token || null);
  }, [accessToken]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch current user
  const fetchCurrentUser = useCallback(async () => {
    try {
      const userData = await usersApi.getCurrentUser();
      setUser(userData);
      return true;
    } catch {
      setUser(null);
      return false;
    }
  }, []);

  // Refresh token function
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const newToken = await authApi.refreshToken();
      setAccessToken(newToken);
      // CRITICAL: Set token in apiClient immediately for subsequent API calls
      apiClient.setAccessToken(newToken.token);
      return true;
    } catch {
      // Refresh failed - clear state
      setAccessToken(null);
      setUser(null);
      apiClient.setAccessToken(null);
      return false;
    }
  }, []);

  // Initialize: Try to refresh token on mount
  useEffect(() => {
    const initialize = async () => {
      try {
        const success = await refreshAccessToken();
        if (success) {
          await fetchCurrentUser();
        }
      } catch {
        // Silent fail - user not authenticated
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, [refreshAccessToken, fetchCurrentUser]);

  // Login function
  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authApi.login(credentials);

        if (
          response.requiredAuthenticatorType &&
          response.requiredAuthenticatorType !== 'None'
        ) {
          // 2FA required
          setError(
            `Two-factor authentication required: ${response.requiredAuthenticatorType}`
          );
          return false;
        }

        if (response.accessToken) {
          setAccessToken(response.accessToken);
          // CRITICAL: Set token in apiClient immediately before fetching user
          // useEffect runs after render, but we need token NOW for API call
          apiClient.setAccessToken(response.accessToken.token);
          await fetchCurrentUser();
          return true;
        }

        setError('Login failed. Access token was not returned by the server.');
        return false;
      } catch (err: unknown) {
        const apiError = err as ApiError;
        const errorMessage =
          apiError?.detail ||
          apiError?.title ||
          'Login failed. Please try again.';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchCurrentUser]
  );

  // Logout function
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.revokeToken();
    } catch {
      // Ignore revoke errors - we'll clear local state anyway
    } finally {
      setAccessToken(null);
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!accessToken) return;

    const expiryDate = new Date(accessToken.expirationDate);
    const timeUntilExpiry = expiryDate.getTime() - Date.now();
    const refreshBuffer = 5 * 60 * 1000; // Refresh 5 minutes before expiry

    if (timeUntilExpiry <= 0) {
      refreshAccessToken();
      return;
    }

    const timeout = setTimeout(
      () => {
        refreshAccessToken();
      },
      Math.max(0, timeUntilExpiry - refreshBuffer)
    );

    return () => clearTimeout(timeout);
  }, [accessToken, refreshAccessToken]);

  const value: AuthContextType = {
    accessToken,
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login,
    logout,
    refreshAccessToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
