# 🚀 Documentation : Architecture Microservices IA-Technology

Ce document explique le fonctionnement de la nouvelle architecture et comment l'utiliser au quotidien.

---

## 🏃 1. Comment démarrer le Backend ?

Pour vous simplifier la vie, un script de démarrage global a été créé. Il compile tout le projet, vérifie Docker, et lance les 4 microservices en arrière-plan.

**Commande pour tout démarrer :**
```bash
cd backend
./start-microservices.sh
```

**Que fait ce script ?**
1. Il lance MySQL via `docker-compose up -d`.
2. Il compile le code Java (`mvn clean install`).
3. Il lance dans l'ordre : Eureka (8761), Auth-Service (8081), Core-Service (8082), API Gateway (8080).

**Pour arrêter les serveurs :**
```bash
pkill -f spring-boot:run
```

---

## 🧪 2. Comment tester l'API ? (Swagger / Postman)

### Où est Swagger ?
Actuellement, les dépendances Swagger (`springdoc-openapi`) **ne sont pas installées** dans vos `pom.xml`. Si vous souhaitez l'utiliser, il faudra ajouter la dépendance SpringDoc dans le `core-service` et le `auth-service`. (N'hésitez pas à me le demander si vous en avez besoin !).

### Comment tester sans Swagger (La méthode recommandée) :
Le point d'entrée unique de votre application est **API-Gateway sur le port 8080**.

**Étape 1 : Obtenir un Token (Login)**
Utilisez Postman, Thunder Client ou cURL pour faire un POST sur l'API Gateway :
* `POST http://localhost:8080/api/auth/signin`
* Body (JSON) : `{"username": "admin", "password": "admin123"}`
* *Résultat* : L'API vous retourne un Token JWT.

**Étape 2 : Accéder aux données (Core)**
Copiez le Token reçu et utilisez-le pour vos autres requêtes :
* `GET http://localhost:8080/api/public/chercheurs`
* Headers : `Authorization: Bearer <votre_token>`
* *Résultat* : La liste des chercheurs depuis la base de données `iatech_core`.

---

## 🏢 3. Explication de la Nouvelle Architecture

Le backend monolithique a été divisé en **4 applications indépendantes**.

### A. Le Routage
1. **`eureka-server` (Port 8761)** : C'est l'annuaire téléphonique. Quand le *Core* et le *Auth* démarrent, ils disent à Eureka "Je suis vivant, voici mon adresse !".
2. **`api-gateway` (Port 8080)** : C'est le videur à la porte du club. Le Frontend Angular (Port 4200) ne parle **plus jamais** aux autres services directement. Il donne toutes ses requêtes à la Gateway, qui lit l'URL et la transfère aux autres.

### B. Les Services Métiers
3. **`auth-service` (Port 8081)** : Gère uniquement la sécurité.
   - *Base de données* : `iatech_auth` (Tables `users`, `roles`, `user_roles`).
   - *Rôle* : Il vérifie si l'utilisateur existe dans sa base. Si oui, il fabrique un JWT (un ticket d'entrée crypté) et l'envoie au Frontend.
4. **`core-service` (Port 8082)** : Le cœur scientifique.
   - *Base de données* : `iatech_core` (Tables `chercheurs`, `publications`, `projets`, `actualités`, etc.).
   - *Rôle* : C'est un service **Stateless** (apatride). Quand il reçoit une requête pour créer un chercheur, il n'interroge pas la base de données *User* ! Il regarde juste le Token JWT, vérifie que la signature mathématique est correcte, lit le rôle de l'utilisateur directement écrit à l'intérieur, et autorise l'action.

---

## 📂 4. Arborescence et Contenu des Fichiers Clés

Voici comment le code est structuré :

### 📁 `ia-technology-backend` (Racine)
- `pom.xml` : C'est le "Parent POM". Il gère les versions globales (Spring Cloud, Java 17).
- `docker-compose.yml` : Lance le serveur MySQL (Port 3306) et phpMyAdmin (Port 8888).
- `start-microservices.sh` : Script bash pour tout démarrer.

### 📁 `auth-service/`
- **`dto/`** : `LoginRequest` (Ce que le serveur reçoit), `JwtResponse` (Ce qu'il renvoie).
- **`entity/`** : `User` et `Role` **exclusivement**. 
- **`security/`** : 
  - `JwtUtils.java` : C'est le fichier **le plus important** ici. Il contient le code qui *fabrique* (generate) le jeton JWT. On a configuré le JWT pour qu'il embarque le tableau des "Rôles" en clair dedans.
  - `WebSecurityConfig.java` : Autorise les chemins `/api/auth/**` pour tout le monde.

### 📁 `core-service/`
- **`controller/`** : `ChercheurController`, `PublicationController`...
  - Ils utilisent `@PreAuthorize("hasRole('ADMIN')")` sur les routes de création.
- **`entity/`** & **`repository/`** : Exclut totalement `User` et `Role`.
- **`security/`** :
  - `AuthTokenFilter.java` : Intercepte les requêtes de l'API Gateway, extrait le JWT de l'en-tête `Authorization`, le décrypte avec la clé secrète, et crée le "SecurityContext" du Spring Boot.
  - `JwtUtils.java` : Il est **différent** de celui du auth-service ! Celui-ci n'a pas de fonction pour "générer" des JWT. Il ne fait que **lire** et vérifier la signature.
- **`aspect/`** : `LoggingAspect.java` qui historise les appels, sauf les connexions.
- `application.yml` : Contient la connexion JDBC vers `iatech_core` et la fameuse clé `jwtSecret` qui doit être **absolument identique** à celle de l'auth-service pour réussir à décoder les jetons !
