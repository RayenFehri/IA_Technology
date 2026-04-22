import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Routing avec support des route inputs (:id → @Input() id)
    provideRouter(routes, withComponentInputBinding()),

    // HttpClient avec l'intercepteur JWT
    provideHttpClient(withInterceptors([authInterceptor])),

    // Animations Angular Material
    provideAnimations()
  ]
};
