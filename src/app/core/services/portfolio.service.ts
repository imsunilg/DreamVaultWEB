import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AssetAllocationItem, PortfolioPerformancePoint, PortfolioSummary } from '../models/portfolio.model';

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/portfolio`;

  getSummary(): Observable<PortfolioSummary> {
    return this.http.get<PortfolioSummary>(`${this.baseUrl}/summary`);
  }

  getAllocation(): Observable<AssetAllocationItem[]> {
    return this.http.get<AssetAllocationItem[]>(`${this.baseUrl}/allocation`);
  }

  getPerformance(): Observable<PortfolioPerformancePoint[]> {
    return this.http.get<PortfolioPerformancePoint[]>(`${this.baseUrl}/performance`);
  }
}
