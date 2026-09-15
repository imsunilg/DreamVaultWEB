export type UserRole = 'Admin' | 'User';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  username: string;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  expiresAtUtc: string;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface CurrentUser {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdDate: string;
  lastLoginDate: string | null;
}
