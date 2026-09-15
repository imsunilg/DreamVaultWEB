import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, ChangePasswordRequest, CurrentUser, LoginRequest, RegisterRequest, UserRole } from '../models/auth.model';

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

  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request).pipe(tap(res => this.storeSession(res, request.rememberMe)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, request).pipe(tap(res => this.storeSession(res, true)));
  }

  changePassword(request: ChangePasswordRequest): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.baseUrl}/change-password`, request);
  }

  updateProfile(request: { firstName: string; lastName?: string; email: string }): Observable<CurrentUser> {
    return this.http.put<CurrentUser>(`${this.baseUrl}/profile`, request).pipe(
      tap(user => {
        const current = this.session();
        if (current) {
          const updated = { ...current, user };
          this.session.set(updated);
          this.persist(updated);
        }
      })
    );
  }

  refreshCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.baseUrl}/me`).pipe(
      tap(user => {
        const current = this.session();
        if (current) {
          const updated = { ...current, user };
          this.session.set(updated);
          this.persist(updated);
        }
      })
    );
  }

  logout(): void {
    this.http.post(`${this.baseUrl}/logout`, {}).subscribe({ next: () => {}, error: () => {} });
    this.session.set(null);

    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors (private browsing, disabled storage, etc.)
    }
  }

  private storeSession(res: AuthResponse, rememberMe: boolean): void {
    const stored: StoredSession = {
      token: res.token,
      expiresAtUtc: res.expiresAtUtc,
      user: {
        userId: res.userId,
        username: res.username,
        firstName: res.fullName.split(' ')[0] ?? res.fullName,
        lastName: res.fullName.split(' ').slice(1).join(' '),
        fullName: res.fullName,
        email: res.email,
        role: res.role,
        createdDate: '',
        lastLoginDate: null
      }
    };
    this.session.set(stored);
    this.persist(stored, rememberMe);
  }

  /**
   * Remember Me -> localStorage (survives browser restarts).
   * Otherwise -> sessionStorage (cleared when the tab closes).
   */
  private persist(stored: StoredSession, rememberMe = this.wasRemembered()): void {
    try {
      const json = JSON.stringify(stored);
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY, json);
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        sessionStorage.setItem(STORAGE_KEY, json);
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors (private browsing, disabled storage, etc.)
    }
  }

  private wasRemembered(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }

  private readStoredSession(): StoredSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw) as StoredSession;
      if (new Date(parsed.expiresAtUtc).getTime() <= Date.now()) return null;

      return parsed;
    } catch {
      return null;
    }
  }
}
