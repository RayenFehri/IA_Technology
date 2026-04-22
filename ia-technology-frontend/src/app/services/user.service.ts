import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const BASE = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(`${BASE}/user/profile`);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${BASE}/user/profile`, data);
  }

  // ─── Admin ──────────────────────────────────────────────────────────────

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${BASE}/admin/users`);
  }

  updateUserRole(id: number, role: string): Observable<User> {
    return this.http.put<User>(`${BASE}/admin/users/${id}/role?role=${role}`, {});
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/admin/users/${id}`);
  }
}
