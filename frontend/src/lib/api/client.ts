import type { ApiError } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5278';

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization header if token exists
    if (this.accessToken) {
      (headers as Record<string, string>)['Authorization'] =
        `Bearer ${this.accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // CRITICAL: Send cookies for RefreshToken
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        type: 'Unknown',
        title: 'An error occurred',
        status: response.status,
      }));
      throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Convenience methods
  get<T>(endpoint: string) {
    return this.fetch<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string) {
    return this.fetch<T>(endpoint, { method: 'DELETE' });
  }
}

// Singleton instance
export const apiClient = new ApiClient();
