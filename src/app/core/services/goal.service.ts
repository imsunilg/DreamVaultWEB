import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Goal } from '../models/goal.model';

@Injectable({ providedIn: 'root' })
export class GoalService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/goals`;

  getAll(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.baseUrl);
  }

  getById(id: number): Observable<Goal> {
    return this.http.get<Goal>(`${this.baseUrl}/${id}`);
  }
}
