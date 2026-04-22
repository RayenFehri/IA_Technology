import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { JwtResponse, LoginRequest, RegisterRequest } from '../models/auth.model';

const TOKEN_KEY = 'ia_token';
const USER_KEY  = 'ia_user';
const BASE_URL  = 'http://localhost:8080/api/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {

  currentUser$ = new BehaviorSubject<JwtResponse | null>(this.getSavedUser());

  constructor(private http: HttpClient) {}

  // ─── HTTP ────────────────────────────────────────────────────────────────

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${BASE_URL}/signin`, credentials).pipe(
      tap(res => {
        this.saveToken(res.token);
        this.saveUser(res);
        this.currentUser$.next(res);
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${BASE_URL}/signup`, data);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser$.next(null);
  }

  // ─── TOKEN ───────────────────────────────────────────────────────────────

  saveToken(token: string): void    { localStorage.setItem(TOKEN_KEY, token); }
  getToken(): string | null          { return localStorage.getItem(TOKEN_KEY); }
  removeToken(): void                { localStorage.removeItem(TOKEN_KEY); }

  // ─── USER ────────────────────────────────────────────────────────────────

  private saveUser(user: JwtResponse): void  { localStorage.setItem(USER_KEY, JSON.stringify(user)); }
  getCurrentUser(): JwtResponse | null        { return this.currentUser$.getValue(); }

  private getSavedUser(): JwtResponse | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  /** Alias public de getCurrentUser() pour compatibilité */
  getUser(): JwtResponse | null { return this.getCurrentUser(); }

  // ─── CHECKS ──────────────────────────────────────────────────────────────

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.roles?.includes('ROLE_ADMIN') ?? false;
  }

  isModerator(): boolean {
    const roles = this.getCurrentUser()?.roles ?? [];
    return roles.includes('ROLE_MODERATEUR') || roles.includes('ROLE_ADMIN');
  }
}
