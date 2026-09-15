import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuditLog, AuditLogQueryParams, LoginLog, LoginLogQueryParams } from '../models/log.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({ providedIn: 'root' })
export class LogService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin`;

  getLoginLogs(query: LoginLogQueryParams): Observable<PagedResult<LoginLog>> {
    let params = new HttpParams().set('page', query.page).set('pageSize', query.pageSize);
    if (query.dateFrom) params = params.set('dateFrom', query.dateFrom);
    if (query.dateTo) params = params.set('dateTo', query.dateTo);
    if (query.username) params = params.set('username', query.username);
    if (query.success !== undefined) params = params.set('success', query.success);

    return this.http.get<PagedResult<LoginLog>>(`${this.baseUrl}/login-logs`, { params });
  }

  getActivityLogs(query: AuditLogQueryParams): Observable<PagedResult<AuditLog>> {
    let params = new HttpParams().set('page', query.page).set('pageSize', query.pageSize);
    if (query.userId) params = params.set('userId', query.userId);
    if (query.action) params = params.set('action', query.action);
    if (query.entityName) params = params.set('entityName', query.entityName);
    if (query.dateFrom) params = params.set('dateFrom', query.dateFrom);
    if (query.dateTo) params = params.set('dateTo', query.dateTo);

    return this.http.get<PagedResult<AuditLog>>(`${this.baseUrl}/activity-logs`, { params });
  }
}
