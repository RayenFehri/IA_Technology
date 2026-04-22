# Guide de Déploiement Complet - IA-Technology

Le développement du projet **IA-Technology** est officiellement terminé. Cette plateforme Full-Stack intégrée avec Spring Boot 3 et Angular 17 est prête pour le déploiement de production.

---

## 1. Architecture Finale des Dossiers

```
IA-Technology/
├── backend/                  # API REST sous Spring Boot 3
│   ├── src/main/java/.../platform/
│   │   ├── config/           # CORS, Security, JWT, Data Initializer
│   │   ├── controller/       # AuthController, AdminController, etc.
│   │   ├── entity/           # User, Role, Chercheur, Publication, Domaine
│   │   ├── exception/        # Gestion d'erreurs globales (404, 400, 403, 500)
│   │   ├── repository/       # Interfaces JPA
│   │   ├── security/         # JWT Utils, Filtres, AuthEntryPoint
│   │   └── service/          # Logique métier des entités
│   ├── src/main/resources/
│   │   └── application.properties # Configuration BD
│   ├── docker-compose.yml    # Configuration MySQL et phpMyAdmin
│   └── pom.xml
│
└── ia-technology-frontend/   # Application Web S.P.A Angular 17
    ├── src/app/
    │   ├── guards/           # AuthGuard, AdminGuard, ModeratorGuard
    │   ├── interceptors/     # JwtInterceptor (auth.interceptor.ts)
    │   ├── models/           # Typescapes pour entités métier
    │   ├── services/         # Appels API (HttpClientRxJS)
    │   ├── pages/            # Composants complets CRUD
    │   │   ├── admin/        # Dashboard, Users
    │   │   ├── auth/         # Login, Register
    │   │   ├── chercheurs/   # Annuaire (list, form, detail)
    │   │   ├── domaines/     # Catégories de recherche
    │   │   ├── error/        # Error pages (404, 403)
    │   │   ├── home/         # Dashboard d'accueil
    │   │   └── publications/ # Liste des publications scientifiques
    │   ├── app.component.ts  # Layout principal
    │   └── app.routes.ts     # Routage complet
    └── angular.json          # Configuration SCSS / Bootstrap 5
```

---

## 2. Prérequis Systèmes
- **Java** : 17 ou supérieur
- **Maven** : >= 3.8
- **Node.js** : >= 18.x
- **Docker** : >= 20.x

---

## 3. Checklist de Lancement (De zéro à Prod)

### A. Base de Données (Docker)
1. Ouvrir le terminal dans dossier `backend/`.
2. Lancer les conteneurs MySQL:
   `docker-compose up -d`
3. Vérifier que la connexion à **localhost:3306** est active.

### B. Lancement du Backend
1. Toujours dans `backend/`, installer et exécuter:
   `mvn clean install`
   `mvn spring-boot:run`
2. L'API est maintenant disponible sur `http://localhost:8080`.
3. 🎉 **Le `DataInitializer` s'est exécuté automatiquement**, peuplant la DB avec :
   - Administrateur: **admin** / **admin123**
   - Modérateur: **moderateur** / **mod123**
   - Domaines, Chercheurs (3) et Mocks de Publications (5).

### C. Lancement du Frontend
1. Ouvrir un second terminal dans `ia-technology-frontend/`.
2. Installer les packages:
   `npm install`
3. Lancer le serveur Angular:
   `npm start`
4. L'application est en ligne sur `http://localhost:4200` !

---

## 4. Endpoints API Globaux & Sécurité

L'architecture backend intègre des règles de sécurité basées sur un token JWT récupéré après le `/signin`.

| Endpoint                           | Méthode  | Accès Requis           | Fonctionnalité |
|------------------------------------|----------|------------------------|----------------|
| `/api/auth/signin`                 | POST     | Public                 | Authentification (Retourne JWT) |
| `/api/auth/signup`                 | POST     | Public                 | Création de compte (rôle USER) |
| `/api/user/profile`                | GET/PUT  | ROLE_USER              | Manipulation du profil personnel |
| `/api/admin/users/**`              | GET/PUT  | ROLE_ADMIN             | Consultation/Changement rôles |
| `/api/public/publications`         | GET      | Public                 | Catalogue global publications |
| `/api/chercheurs`                  | GET      | Public                 | Annuaire des chercheurs |
| `/api/chercheurs/{id}`             | PUT/DEL  | ROLE_ADMIN             | Editer/Supprimer un chercheur |
| `/* (méthodes C.R.U.D)`            | -        | ADMIN / MODERATOR      | Accès protégé aux suppressions/modifs |

_Rappel : toutes les routes d'erreur (404, 401, 403, 500) sont capturées côté serveur puis traduites dans des ErrorResponse structurées reconnues proprement par le client Angular._
