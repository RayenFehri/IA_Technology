import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div class="text-center p-5 bg-white shadow-lg rounded-4 border-top border-danger border-5">
        <h1 class="display-1 fw-bold text-danger mb-0"><i class="bi bi-shield-lock"></i></h1>
        <h2 class="mb-4 mt-3 fw-bold text-dark">Accès Refusé (403)</h2>
        <p class="mb-5 text-secondary">Vous n'avez pas les autorisations nécessaires pour accéder à cette section.</p>
        <div class="d-flex justify-content-center gap-3">
          <a routerLink="/home" class="btn btn-outline-secondary btn-lg rounded-pill px-4">Accueil</a>
          <a routerLink="/login" class="btn btn-danger btn-lg rounded-pill px-4 shadow">Se connecter</a>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {}
