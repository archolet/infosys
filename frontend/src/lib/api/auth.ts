import { apiClient } from './client';
import type { LoginRequest, LoginResponse, AccessToken } from '@/types/auth';

export const authApi = {
  /**
   * Login with email and password
   * RefreshToken is automatically set as HttpOnly cookie by backend
   */
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/api/Auth/Login', credentials);
  },

  /**
   * Refresh access token using HttpOnly refresh token cookie
   * Cookie is sent automatically with credentials: 'include'
   */
  refreshToken: (): Promise<AccessToken> => {
    return apiClient.get<AccessToken>('/api/Auth/RefreshToken');
  },

  /**
   * Revoke current refresh token (logout)
   * This invalidates the HttpOnly cookie on the backend
   */
  revokeToken: (): Promise<void> => {
    return apiClient.put<void>('/api/Auth/RevokeToken', null);
  },
};
