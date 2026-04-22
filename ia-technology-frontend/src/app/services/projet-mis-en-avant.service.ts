import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjetMisEnAvant } from '../models/projet-mis-en-avant.model';

const BASE_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ProjetMisEnAvantService {

  constructor(private http: HttpClient) { }

  getActifs(): Observable<ProjetMisEnAvant[]> {
    return this.http.get<ProjetMisEnAvant[]>(`${BASE_URL}/public/projets-mis-en-avant`);
  }

  getAll(): Observable<ProjetMisEnAvant[]> {
    return this.http.get<ProjetMisEnAvant[]>(`${BASE_URL}/moderateur/projets-mis-en-avant`);
  }

  create(data: any): Observable<ProjetMisEnAvant> {
    return this.http.post<ProjetMisEnAvant>(`${BASE_URL}/moderateur/projets-mis-en-avant`, data);
  }

  update(id: number, data: any): Observable<ProjetMisEnAvant> {
    return this.http.put<ProjetMisEnAvant>(`${BASE_URL}/moderateur/projets-mis-en-avant/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/moderateur/projets-mis-en-avant/${id}`);
  }

  changerOrdre(id: number, ordre: number): Observable<any> {
    let params = new HttpParams().set('nouvelOrdre', ordre.toString());
    return this.http.put(`${BASE_URL}/moderateur/projets-mis-en-avant/${id}/ordre`, null, { params });
  }
}
