## Cahier des charges — Projet de réservation pour un restaurant fictif

### 1. Contexte & Objectifs

**Nom du restaurant :** Le Jardin Gourmand
**Concept :** Restaurant moderne proposant une cuisine franco-méditerranéenne dans un cadre végétalisé et cosy.
**Type de clientèle :** Couples, familles, groupes d’amis, et clients d’affaires recherchant une ambiance détendue et une bonne cuisine.

**Objectif de l’application :**
Développer une application mobile permettant aux clients de :

* Consulter le menu
* Réserver une table en fonction des disponibilités
* Recevoir une confirmation ou un rappel de réservation

L’application permettra également au personnel (hôte/serveur) de gérer les réservations en back-office.

---

### 2. Cibles & rôles utilisateurs

**Client (utilisateur mobile)**

* Voir le menu
* Rechercher une date/heure disponible
* Réserver une table (nom, téléphone, date, heure, nombre de couverts)
* Modifier ou annuler une réservation
* (Optionnel) Créer un compte ou se connecter

**Hôte / Serveur (utilisateur back-office)**

* Voir la liste des réservations
* Valider ou refuser une réservation
* Gérer les plages horaires et les disponibilités
* (Optionnel) Gérer le plan de salle

**Admin (optionnel)**

* Gérer les menus, horaires, restaurants
* Ajouter/supprimer un restaurant (multisite)

---

### 3. Fonctionnalités principales

**Application Flutter (Mobile)**

* Écran d’accueil avec présentation du restaurant
* Affichage du menu
* Formulaire de réservation (nom, téléphone, date, heure, nombre de couverts)
* Confirmation de réservation par e-mail (SMTP)
* Écran de gestion pour le personnel (back-office)
* (Optionnel) Authentification client (email/mot de passe)

**API REST (Node.js + Express)**

* Endpoints CRUD pour les réservations :

    * `GET /reservations`
    * `POST /reservations`
    * `PUT /reservations/:id`
    * `DELETE /reservations/:id`
* Vérification de disponibilité : `GET /availability`
* (Optionnel) Authentification : `POST /login`, `POST /register`

**Base de données (PostgreSQL)**

* Tables principales : `users`, `reservations`, `menus`, `tables`

---

### 4. Contraintes techniques & choix de stack

| Élément            | Choix retenu         |
| ------------------ | -------------------- |
| Application mobile | Flutter (Dart ≥ 3.0) |
| API                | Node.js avec Express |
| Base de données    | PostgreSQL           |
| Authentification   | JWT (token simple)   |
| Notifications      | Email (SMTP)         |

---

### 5. Livrables attendus (étape 1)

* Maquettes ou wireframes (Figma ou outil équivalent)
* Backlog de user stories (Notion ou Trello)
* Dépôt GitHub avec README, structure de base et premiers commits
* Board Trello ou Notion avec répartition des tâches entre les 5 membres

