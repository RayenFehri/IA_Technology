import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const moderatorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  if (authService.isModerator()) {
    return true;
  }
  if (authService.isLoggedIn()) {
    return router.createUrlTree(['/home']);
  }
  return router.createUrlTree(['/login']);
};
