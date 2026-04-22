import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Domaine } from '../models/domaine.model';

const BASE = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class DomaineService {

  constructor(private http: HttpClient) {}

  // ─── Public ─────────────────────────────────────────────────────────────

  getAll(): Observable<Domaine[]> {
    return this.http.get<Domaine[]>(`${BASE}/public/domaines`);
  }

  getById(id: number): Observable<Domaine> {
    return this.http.get<Domaine>(`${BASE}/public/domaines/${id}`);
  }

  search(nom: string): Observable<Domaine[]> {
    const params = new HttpParams().set('nom', nom);
    return this.http.get<Domaine[]>(`${BASE}/public/domaines/search`, { params });
  }

  // ─── Admin ──────────────────────────────────────────────────────────────

  create(data: Domaine): Observable<Domaine> {
    return this.http.post<Domaine>(`${BASE}/admin/domaines`, data);
  }

  update(id: number, data: Domaine): Observable<Domaine> {
    return this.http.put<Domaine>(`${BASE}/admin/domaines/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/admin/domaines/${id}`);
  }
}
