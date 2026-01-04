import { apiClient } from './client';
import type { User } from '@/types/user';

export const usersApi = {
  /**
   * Get current authenticated user from JWT token
   * Requires valid access token in Authorization header
   */
  getCurrentUser: (): Promise<User> => {
    return apiClient.get<User>('/api/Users/GetFromAuth');
  },

  /**
   * Get user by ID
   */
  getById: (id: string): Promise<User> => {
    return apiClient.get<User>(`/api/Users/${id}`);
  },
};
