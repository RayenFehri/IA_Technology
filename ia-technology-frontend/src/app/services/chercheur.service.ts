import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chercheur } from '../models/chercheur.model';

const BASE = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class ChercheurService {

  constructor(private http: HttpClient) {}

  // ─── Public ─────────────────────────────────────────────────────────────

  getAll(): Observable<Chercheur[]> {
    return this.http.get<Chercheur[]>(`${BASE}/public/chercheurs`);
  }

  getById(id: number): Observable<Chercheur> {
    return this.http.get<Chercheur>(`${BASE}/public/chercheurs/${id}`);
  }

  search(nom: string): Observable<Chercheur[]> {
    const params = new HttpParams().set('nom', nom);
    return this.http.get<Chercheur[]>(`${BASE}/public/chercheurs/search`, { params });
  }

  getByDomaine(domaineId: number): Observable<Chercheur[]> {
    return this.http.get<Chercheur[]>(`${BASE}/public/chercheurs/domaine/${domaineId}`);
  }

  // ─── Admin ──────────────────────────────────────────────────────────────

  uploadPhoto(file: File): Observable<{fileName: string, fileDownloadUri: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{fileName: string, fileDownloadUri: string}>(`${BASE}/files/upload`, formData);
  }

  create(data: Chercheur): Observable<Chercheur> {
    return this.http.post<Chercheur>(`${BASE}/admin/chercheurs`, data);
  }

  update(id: number, data: Chercheur): Observable<Chercheur> {
    return this.http.put<Chercheur>(`${BASE}/admin/chercheurs/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/admin/chercheurs/${id}`);
  }
}
