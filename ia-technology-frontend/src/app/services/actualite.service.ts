import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Actualite } from '../models/actualite.model';

const BASE_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ActualiteService {

  constructor(private http: HttpClient) { }

  getAllVisible(): Observable<Actualite[]> {
    return this.http.get<Actualite[]>(`${BASE_URL}/public/actualites`);
  }

  getById(id: number): Observable<Actualite> {
    return this.http.get<Actualite>(`${BASE_URL}/public/actualites/${id}`);
  }

  getEpingles(): Observable<Actualite[]> {
    return this.http.get<Actualite[]>(`${BASE_URL}/public/actualites/epingles`);
  }

  getByCategorie(cat: string): Observable<Actualite[]> {
    return this.http.get<Actualite[]>(`${BASE_URL}/public/actualites/categorie/${cat}`);
  }

  getAllForMod(): Observable<Actualite[]> {
    return this.http.get<Actualite[]>(`${BASE_URL}/moderateur/actualites`);
  }

  create(data: any): Observable<Actualite> {
    return this.http.post<Actualite>(`${BASE_URL}/moderateur/actualites`, data);
  }

  update(id: number, data: any): Observable<Actualite> {
    return this.http.put<Actualite>(`${BASE_URL}/moderateur/actualites/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${BASE_URL}/moderateur/actualites/${id}`);
  }

  toggleVisibilite(id: number): Observable<any> {
    return this.http.put(`${BASE_URL}/moderateur/actualites/${id}/visibilite`, {});
  }

  toggleEpingle(id: number): Observable<any> {
    return this.http.put(`${BASE_URL}/moderateur/actualites/${id}/epingle`, {});
  }
}
