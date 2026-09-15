import { UserRole } from './auth.model';

export interface UserListItem {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isLocked: boolean;
  createdDate: string;
  lastLoginDate: string | null;
}

export interface UserDetail {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isLocked: boolean;
  failedLoginCount: number;
  lastFailedLoginDate: string | null;
  lastLoginDate: string | null;
  createdDate: string;
  updatedDate: string;
}

export interface AdminCreateUserRequest {
  username: string;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

export interface AdminUpdateUserRequest {
  username: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export interface AdminResetPasswordRequest {
  newPassword: string;
}

export interface AdminUserQueryParams {
  page: number;
  pageSize: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: string;
}
