import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contribution, ContributionCreateRequest, Dream, DreamCreateRequest, DreamUpdateRequest } from '../models/dream.model';

@Injectable({ providedIn: 'root' })
export class DreamService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/dreams`;

  getAll(): Observable<Dream[]> {
    return this.http.get<Dream[]>(this.baseUrl);
  }

  getById(id: number): Observable<Dream> {
    return this.http.get<Dream>(`${this.baseUrl}/${id}`);
  }

  create(dream: DreamCreateRequest): Observable<Dream> {
    return this.http.post<Dream>(this.baseUrl, dream);
  }

  update(id: number, dream: DreamUpdateRequest): Observable<Dream> {
    return this.http.put<Dream>(`${this.baseUrl}/${id}`, dream);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getContributions(dreamId: number): Observable<Contribution[]> {
    return this.http.get<Contribution[]>(`${this.baseUrl}/${dreamId}/contributions`);
  }

  addContribution(dreamId: number, contribution: ContributionCreateRequest): Observable<Contribution> {
    return this.http.post<Contribution>(`${this.baseUrl}/${dreamId}/contributions`, contribution);
  }
}
