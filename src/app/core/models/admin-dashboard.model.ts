export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  lockedUsers: number;
  adminUsers: number;
  normalUsers: number;
  newUsersThisMonth: number;
  loginAttemptsToday: number;
  successfulLoginsToday: number;
  failedLoginsToday: number;
}

export interface UserGrowthPoint {
  month: string;
  newUsers: number;
}

export interface LoginActivityPoint {
  date: string;
  successCount: number;
  failedCount: number;
}

export interface UserStatusBreakdown {
  active: number;
  inactive: number;
  locked: number;
}

export interface RoleDistribution {
  admin: number;
  user: number;
}

export interface RecentActivityItem {
  action: string;
  description: string | null;
  username: string | null;
  createdDate: string;
}

export interface AdminDashboard {
  stats: AdminDashboardStats;
  userGrowth: UserGrowthPoint[];
  loginActivity: LoginActivityPoint[];
  userStatus: UserStatusBreakdown;
  roleDistribution: RoleDistribution;
  recentActivity: RecentActivityItem[];
}
