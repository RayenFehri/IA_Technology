import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div class="text-center p-5 bg-white shadow-lg rounded-4">
        <h1 class="display-1 fw-bold text-primary mb-0">404</h1>
        <h3 class="mb-4 text-muted">Page Introuvable</h3>
        <p class="mb-5 text-secondary">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        <a routerLink="/home" class="btn btn-primary btn-lg rounded-pill px-5 shadow">Retour à l'accueil</a>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
