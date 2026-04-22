import { Routes } from '@angular/router';
import { authGuard }      from './guards/auth.guard';
import { adminGuard }     from './guards/admin.guard';
import { moderatorGuard } from './guards/moderator.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // ─── Public ─────────────────────────────────────────────────────────────
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'chercheurs',
    loadComponent: () => import('./pages/chercheurs/list-chercheur/list-chercheur.component').then(m => m.ListChercheurComponent)
  },
  {
    path: 'chercheurs/:id',
    loadComponent: () => import('./pages/chercheurs/detail-chercheur/detail-chercheur.component').then(m => m.DetailChercheurComponent)
  },
  {
    path: 'publications',
    loadComponent: () => import('./pages/publications/list-publication/list-publication.component').then(m => m.ListPublicationComponent)
  },
  {
    path: 'publications/:id',
    loadComponent: () => import('./pages/publications/detail-publication/detail-publication.component').then(m => m.DetailPublicationComponent)
  },
  {
    path: 'domaines',
    loadComponent: () => import('./pages/domaines/list-domaine/list-domaine.component').then(m => m.ListDomaineComponent)
  },

  // ─── Connecté ───────────────────────────────────────────────────────────
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },

  // ─── Modérateur ─────────────────────────────────────────────────────────
  {
    path: 'moderateur',
    canActivate: [moderatorGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./components/moderateur/dashboard/moderateur-dashboard/moderateur-dashboard.component').then(m => m.ModerateurDashboardComponent)
      },
      { 
        path: 'actualites', 
        loadComponent: () => import('./components/moderateur/actualites/gestion-actualites/gestion-actualites.component').then(m => m.GestionActualitesComponent)
      },
      { 
        path: 'actualites/creer', 
        loadComponent: () => import('./components/moderateur/actualites/form/form-actualite/form-actualite.component').then(m => m.FormActualiteComponent)
      },
      { 
        path: 'actualites/modifier/:id', 
        loadComponent: () => import('./components/moderateur/actualites/form/form-actualite/form-actualite.component').then(m => m.FormActualiteComponent)
      },
      { 
        path: 'projets', 
        loadComponent: () => import('./components/moderateur/projets/gestion-projets/gestion-projets.component').then(m => m.GestionProjetsComponent)
      },
      { 
        path: 'projets/creer', 
        loadComponent: () => import('./components/moderateur/projets/form/form-projet/form-projet.component').then(m => m.FormProjetComponent)
      },
      { 
        path: 'projets/modifier/:id', 
        loadComponent: () => import('./components/moderateur/projets/form/form-projet/form-projet.component').then(m => m.FormProjetComponent)
      }
    ]
  },

  // ─── Admin (children) ───────────────────────────────────────────────────
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'chercheurs',
        loadComponent: () => import('./pages/chercheurs/list-chercheur/list-chercheur.component').then(m => m.ListChercheurComponent)
      },
      {
        path: 'chercheurs/nouveau',
        loadComponent: () => import('./pages/chercheurs/form-chercheur/form-chercheur.component').then(m => m.FormChercheurComponent)
      },
      {
        path: 'chercheurs/editer/:id',
        loadComponent: () => import('./pages/chercheurs/form-chercheur/form-chercheur.component').then(m => m.FormChercheurComponent)
      },
      {
        path: 'publications',
        loadComponent: () => import('./pages/publications/list-publication/list-publication.component').then(m => m.ListPublicationComponent)
      },
      {
        path: 'publications/nouveau',
        loadComponent: () => import('./pages/publications/form-publication/form-publication.component').then(m => m.FormPublicationComponent)
      },
      {
        path: 'publications/editer/:id',
        loadComponent: () => import('./pages/publications/form-publication/form-publication.component').then(m => m.FormPublicationComponent)
      },
      {
        path: 'domaines',
        loadComponent: () => import('./pages/domaines/list-domaine/list-domaine.component').then(m => m.ListDomaineComponent)
      },
      {
        path: 'domaines/nouveau',
        loadComponent: () => import('./pages/domaines/form-domaine/form-domaine.component').then(m => m.FormDomaineComponent)
      },
      {
        path: 'domaines/editer/:id',
        loadComponent: () => import('./pages/domaines/form-domaine/form-domaine.component').then(m => m.FormDomaineComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/admin/manage-users/manage-users.component').then(m => m.ManageUsersComponent)
      }
    ]
  },

  // ─── Fallback (Erreurs) ─────────────────────────────────────────────────
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/error/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: 'not-found',
    loadComponent: () => import('./pages/error/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  { path: '**', redirectTo: '/not-found' }
];
