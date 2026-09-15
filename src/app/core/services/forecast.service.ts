import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CagrRequest,
  CagrResult,
  ForecastRequest,
  ForecastResult,
  GoalForecastRequest,
  GoalForecastResult,
  SipRequest,
  SipResult
} from '../models/forecast.model';

@Injectable({ providedIn: 'root' })
export class ForecastService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/forecast`;

  calculateForecast(request: ForecastRequest): Observable<ForecastResult> {
    return this.http.post<ForecastResult>(this.baseUrl, request);
  }

  calculateCagr(request: CagrRequest): Observable<CagrResult> {
    return this.http.post<CagrResult>(`${this.baseUrl}/cagr`, request);
  }

  calculateSip(request: SipRequest): Observable<SipResult> {
    return this.http.post<SipResult>(`${this.baseUrl}/sip`, request);
  }

  calculateGoalForecast(request: GoalForecastRequest): Observable<GoalForecastResult> {
    return this.http.post<GoalForecastResult>(`${this.baseUrl}/goal`, request);
  }
}
