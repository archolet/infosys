// Auth request types (match backend DTOs)
export interface LoginRequest {
  email: string;
  password: string;
  authenticatorCode?: string;
}

// Response types (match backend LoggedHttpResponse)
export interface AccessToken {
  token: string;
  expirationDate: string; // ISO date string
}

export interface LoginResponse {
  accessToken: AccessToken | null;
  requiredAuthenticatorType: AuthenticatorType | null;
}

export type AuthenticatorType = 'None' | 'Email' | 'Otp';

// Auth state for context
export interface AuthState {
  accessToken: AccessToken | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

// API Error type (match backend ProblemDetails)
export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail?: string;
  errors?: Record<string, string[]>;
}
