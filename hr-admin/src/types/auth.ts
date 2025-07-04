export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions?: string[];
  roles?: string[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
} 