import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }
  // Connecté mais pas admin → page d'accueil
  if (authService.isLoggedIn()) {
    return router.createUrlTree(['/home']);
  }
  return router.createUrlTree(['/login']);
};
