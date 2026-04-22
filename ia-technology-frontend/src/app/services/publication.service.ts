import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Publication, TypePublication } from '../models/publication.model';

const BASE = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class PublicationService {

  constructor(private http: HttpClient) {}

  // ─── Public ─────────────────────────────────────────────────────────────

  getAll(): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${BASE}/public/publications`);
  }

  getById(id: number): Observable<Publication> {
    return this.http.get<Publication>(`${BASE}/public/publications/${id}`);
  }

  search(motCle: string): Observable<Publication[]> {
    const params = new HttpParams().set('motCle', motCle);
    return this.http.get<Publication[]>(`${BASE}/public/publications/search`, { params });
  }

  getByDomaine(domaineId: number): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${BASE}/public/publications/domaine/${domaineId}`);
  }

  getByType(type: TypePublication): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${BASE}/public/publications/type/${type}`);
  }

  // ─── User+ ──────────────────────────────────────────────────────────────

  getByChercheur(chercheurId: number): Observable<Publication[]> {
    return this.http.get<Publication[]>(`${BASE}/user/publications/chercheur/${chercheurId}`);
  }

  // ─── Admin ──────────────────────────────────────────────────────────────

  uploadFile(file: File): Observable<{fileName: string, fileDownloadUri: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{fileName: string, fileDownloadUri: string}>(`${BASE}/files/upload`, formData);
  }

  create(data: Publication): Observable<Publication> {
    return this.http.post<Publication>(`${BASE}/admin/publications`, data);
  }

  update(id: number, data: Publication): Observable<Publication> {
    return this.http.put<Publication>(`${BASE}/admin/publications/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/admin/publications/${id}`);
  }
}
