export interface LoginLog {
  loginLogId: number;
  username: string;
  loginDateTime: string;
  logoutDateTime: string | null;
  success: boolean;
  failureReason: string | null;
  ipAddress: string | null;
  browser: string | null;
  device: string | null;
  operatingSystem: string | null;
}

export interface AuditLog {
  auditLogId: number;
  userId: number | null;
  username: string | null;
  action: string;
  entityName: string | null;
  entityId: string | null;
  description: string | null;
  createdDate: string;
}

export interface LoginLogQueryParams {
  page: number;
  pageSize: number;
  dateFrom?: string;
  dateTo?: string;
  username?: string;
  success?: boolean;
}

export interface AuditLogQueryParams {
  page: number;
  pageSize: number;
  userId?: number;
  action?: string;
  entityName?: string;
  dateFrom?: string;
  dateTo?: string;
}
