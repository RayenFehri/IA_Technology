import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router      = inject(Router);
  const toast       = inject(ToastService);

  const token = authService.getToken();

  // Cloner la requête en ajoutant le header Authorization si token disponible
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 0:
          toast.showError('Vérifiez votre connexion internet');
          break;
        case 401:
          toast.showWarning('Votre session a expiré, veuillez vous reconnecter');
          authService.logout();
          router.navigate(['/login']);
          break;
        case 403:
          toast.showError('Accès refusé : permissions insuffisantes');
          router.navigate(['/unauthorized']);
          break;
        case 404:
          toast.showError('Ressource introuvable');
          break;
        case 409:
          // Conflict géré par le composant appelant
          break;
        case 500:
          toast.showError('Erreur serveur. Veuillez réessayer plus tard.');
          break;
        default:
          if (err.status >= 400) {
            const msg = err.error?.message || err.message || 'Une erreur est survenue';
            toast.showError(msg);
          }
      }
      return throwError(() => err);
    })
  );
};
