#!/bin/bash

echo "🚀 Démarrage de l'infrastructure IA-Technology..."
echo "=================================================="

# 1. Vérification de la base de données (si Docker est utilisé)
echo "[1/5] Lancement des bases de données MySQL (via docker-compose)..."
docker-compose up -d

echo "[INFO] Compilation de l'ensemble du projet..."
mvn clean install -DskipTests

# On tue les anciennes instances potentiellement ouvertes
pkill -f spring-boot:run

# 2. Lancement du serveur d'annuaire (Eureka)
echo "[2/5] Démarrage de Eureka Server (Port 8761)..."
nohup mvn spring-boot:run -pl eureka-server > eureka.log 2>&1 &
sleep 5 # On attend un peu que l'annuaire se lève

# 3. Lancement des services métier
echo "[3/5] Démarrage du Auth Service (Port 8081)..."
nohup mvn spring-boot:run -pl auth-service > auth.log 2>&1 &

echo "[4/5] Démarrage du Core Service (Port 8082)..."
nohup mvn spring-boot:run -pl core-service > core.log 2>&1 &
sleep 15 # On laisse le temps au contexte de se charger

# 4. Lancement de la Gateway
echo "[5/5] Démarrage de API Gateway (Port 8080)..."
nohup mvn spring-boot:run -pl api-gateway > gateway.log 2>&1 &

echo "=================================================="
echo "✅ Tous les services ont été dispatchés en arrière-plan !"
echo ""
echo "📊 Pour suivre les logs, utilisez :"
echo " - tail -f eureka.log"
echo " - tail -f gateway.log"
echo " - tail -f auth.log"
echo " - tail -f core.log"
echo ""
echo "🛑 Pour tout arrêter, tapez : pkill -f spring-boot:run"
