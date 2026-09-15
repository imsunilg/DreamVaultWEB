import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, CurrentUser, LoginRequest, RegisterRequest } from '../models/auth.model';

const STORAGE_KEY = 'dreamvault-auth';

interface StoredSession {
  token: string;
  expiresAtUtc: string;
  user: CurrentUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/auth`;

  private session = signal<StoredSession | null>(this.readStoredSession());

  readonly currentUser = computed(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => {
    const s = this.session();
    return !!s && new Date(s.expiresAtUtc).getTime() > Date.now();
  });
  readonly isAdmin = computed(() => this.currentUser()?.role === 'Admin');

  get token(): string | null {
    return this.session()?.token ?? null;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(tap(res => this.storeSession(res)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request).pipe(tap(res => this.storeSession(res)));
  }

  logout(): void {
    this.session.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors (private browsing, disabled storage, etc.)
    }
  }

  private storeSession(res: AuthResponse): void {
    const stored: StoredSession = {
      token: res.token,
      expiresAtUtc: res.expiresAtUtc,
      user: { userId: res.userId, name: res.name, email: res.email, role: res.role }
    };
    this.session.set(stored);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Ignore storage errors (private browsing, disabled storage, etc.)
    }
  }

  private readStoredSession(): StoredSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw) as StoredSession;
      if (new Date(parsed.expiresAtUtc).getTime() <= Date.now()) return null;

      return parsed;
    } catch {
      return null;
    }
  }
}
