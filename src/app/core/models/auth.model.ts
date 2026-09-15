export type UserRole = 'Admin' | 'User';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresAtUtc: string;
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface CurrentUser {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
}
