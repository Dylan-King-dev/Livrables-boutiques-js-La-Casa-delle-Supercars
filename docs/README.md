# 🏎️ La Casa delle Supercars — Boutique E-Commerce

> Projet réalisé dans le cadre du module **Challenge JS** — Ynov Campus Sophia
> Groupe de 2 : **Dylan KING** & **Florian Azria**

---

## 📋 Table des matières

1. [Présentation du projet](#-présentation-du-projet)
2. [Fonctionnalités](#-fonctionnalités)
3. [Stack technique](#-stack-technique)
4. [Arborescence du projet](#-arborescence-du-projet)
5. [Installation et lancement](#-installation-et-lancement)
6. [Configuration de la base de données](#-configuration-de-la-base-de-données)
7. [Variables d'environnement](#-variables-denvironnement)
8. [Organisation de l'équipe](#-organisation-de-léquipe)
9. [Ordre des tâches réalisées](#-ordre-des-tâches-réalisées)
10. [Schéma de la base de données](#-schéma-de-la-base-de-données)
11. [Routes API](#-routes-api)
12. [Conventions Git](#-conventions-git)

---

## 🏁 Présentation du projet

**La Casa delle Supercars** est un site e-commerce spécialisé dans la vente de véhicules et produits dérivés des marques **Maserati** et **Porsche**.

Le projet a été développé en binôme dans le cadre du module Challenge JS. Il met en pratique les compétences suivantes :
- Manipulation du DOM en JavaScript vanilla
- Consommation d'une API REST
- Développement backend avec Express.js
- Gestion d'une base de données relationnelle MySQL
- Persistance des données côté client avec le localStorage
- Responsive design (desktop, tablette, smartphone)
- Gestion de projet en équipe avec Git

---

## ✅ Fonctionnalités

### Catalogue
- Affichage de la liste des produits (nom, prix, image)
- Changement d'image au survol (image 1 → image 2)
- Badge promotionnel sur les produits en réduction
- Filtrage des produits (par marque, couleur, type, etc.)
- Tri par prix croissant et décroissant
- Recherche par nom de produit *(bonus)*

### Fiche produit
- Affichage des détails complets du produit
- Description tronquée à 150 caractères avec bouton "Voir plus"
- Carrousel d'images avec flèches et miniatures
- Sélection de couleur
- Affichage des caractéristiques (marque, type, couleurs, tailles)
- Produits similaires suggérés
- Ajout au panier avec choix de quantité

### Panier
- Ajout, modification et suppression de produits
- Mise à jour automatique du stock lors d'un achat
- Passage de commande
- Persistance via localStorage

### Favoris
- Ajout et suppression de produits favoris
- Page dédiée pour consulter ses favoris
- Persistance via localStorage

### Livraison *(bonus)*
- Saisie d'une adresse de livraison réelle
- Sauvegarde de l'adresse dans le localStorage

### Paiement *(bonus)*
- Simulation d'un système de paiement

### Gestion des promotions
- Réductions en pourcentage appliquées sur les prix
- Prix barré + prix réduit affiché

### Gestion des stocks
- Décrémentation automatique du stock lors d'une commande
- Affichage de la disponibilité produit

---

## 🛠️ Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | HTML5, CSS3, JavaScript vanilla |
| Backend | Node.js, Express.js |
| Base de données | MySQL |
| Versioning | Git + GitHub |
| Variables d'env | dotenv |

> ⚠️ L'utilisation de frameworks frontend (React, Vue, Angular, etc.) est **interdite** par le cahier des charges.

---

## 🚀 Installation et lancement

### Prérequis

- [Node.js](https://nodejs.org/) installé sur votre machine
- [MySQL](https://www.mysql.com/) installé et en cours d'exécution
- [Git](https://git-scm.com/) installé

### Étapes

**1. Cloner le repository**
```bash
git clone https://github.com/[nom-utilisateur]/La-Casa-delle-Supercars.git
cd La-Casa-delle-Supercars
```

**2. Installer les dépendances backend**
```bash
cd backend
npm install
```

**3. Configurer les variables d'environnement**

Créer un fichier `.env` dans le dossier `backend/` :
```
DB_HOST=localhost
DB_USER=root
DB_PASS=votre_mot_de_passe
DB_NAME=boutique_auto
PORT=3000
```


**4. Créer la base de données**
```bash
mysql -u root -p < docs/boutique_auto_setup.sql
```

**5. Lancer le serveur backend**
```bash
cd backend
node app.js
```

**6. Ouvrir le frontend**

Ouvrir `frontend/pages/index.html` dans votre navigateur, ou utiliser l'extension **Live Server** dans VS Code.

---

## 🗄️ Configuration de la base de données

Le fichier `docs/boutique_auto_setup.sql` contient le script complet de création des tables. Voici la structure principale :

---

## 🔐 Variables d'environnement

Le fichier `.env` ne doit **jamais** être commité sur GitHub. Il est listé dans le `.gitignore`.

Voici les variables nécessaires :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DB_HOST` | Hôte MySQL | `localhost` |
| `DB_USER` | Utilisateur MySQL | `root` |
| `DB_PASS` | Mot de passe MySQL | `monmotdepasse` |
| `DB_NAME` | Nom de la base de données | `boutique_auto` |
| `PORT` | Port du serveur Express | `3000` |

---

## 👥 Organisation de l'équipe

### Répartition des rôles

| Tâche | Responsable |
|-------|-------------|
| Structure HTML / CSS global + responsive | King Dylan |
| Page catalogue (affichage, filtres, tri, recherche) | King Dylan |
| Page fiche produit + carrousel | King Dylan |
| Backend Express + routes API | Azria Florian |
| Base de données MySQL + schéma | Azria Florian |
| Panier (frontend + backend) | King Dylan |
| Favoris + Livraison | King Dylan |
| Gestion des stocks et promotions | King Dylan + Azria Florian |
| Bonus : Recherche + Paiement | King Dylan |
| README + Documentation | King Dylan + Azria Florian |
| Slides de présentation | King Dylan |

### Outils de communication et gestion de projet

- **GitHub Projects** ou **Trello** : suivi des tâches (todo / en cours / terminé)
- **Discord** : communication quotidienne entre les deux membres
- **Git** : versioning avec branches par fonctionnalité

---

## 📅 Ordre des tâches réalisées

Les tâches ont été réalisées dans l'ordre suivant afin de respecter les dépendances entre les fonctionnalités :

### Phase 1 — Mise en place du projet
1. Création du repository GitHub et invitation du binôme
2. Création de l'arborescence complète du projet
3. Rédaction du `.gitignore` (`.env`, `node_modules/`)
4. Initialisation du backend : `npm init -y` puis `npm install express mysql2 dotenv cors`
5. Création du fichier `.env` (jamais commité)
6. Création du schéma de base de données (`schema.sql`) et import MySQL

### Phase 2 — Données et backend
7. Insertion des 20+ produits en base de données (10 Maserati, 10 Porsche minimum)
8. Création de la connexion MySQL dans `db.js`
9. Création du serveur Express dans `app.js`
10. Développement des routes et controllers pour les produits
11. Test des routes avec un outil comme **Postman** ou **Thunder Client**

### Phase 3 — Frontend catalogue
12. Création de la structure HTML de base + navbar + footer
13. CSS global et responsive (media queries)
14. Page `catalogue.html` : affichage dynamique des produits via `fetch`
15. Ajout des filtres (marque, couleur, type)
16. Ajout du tri par prix
17. Hover sur les cartes produit (changement d'image)
18. Badge promotion sur les produits en réduction

### Phase 4 — Fiche produit
19. Page `produit.html` : récupération et affichage des données
20. Carrousel d'images avec flèches et miniatures
21. Description tronquée + bouton "Voir plus"
22. Sélection de couleur
23. Produits similaires
24. Bouton ajout au panier

### Phase 5 — Panier et commandes
25. Page `panier.html` : affichage des produits ajoutés (localStorage)
26. Modification de quantité et suppression d'articles
27. Calcul du total avec réductions
28. Passage de commande : envoi en base + décrémentation du stock

### Phase 6 — Favoris et livraison
29. Système de favoris (ajout/suppression/consultation via localStorage)
30. Page de livraison avec sauvegarde de l'adresse

### Phase 7 — Bonus
31. Barre de recherche par nom de produit
32. Simulation de paiement

### Phase 8 — Finalisation
33. Tests complets sur desktop, tablette et smartphone
34. Correction des bugs
35. Vérification que `.env` n'est pas dans le repo
36. Rédaction finale du README
37. Préparation des slides de présentation
38. **Dépôt du lien GitHub sur Moodle avant le lundi 13 avril à 8h45**

---

## 🔌 Routes API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/produits` | Récupérer tous les produits |
| GET | `/api/produits?marque=Maserati` | Filtrer par marque |
| GET | `/api/produits?search=ghibli` | Recherche par nom |
| GET | `/api/produits/:id` | Récupérer un produit par son ID |
| POST | `/api/commandes` | Créer une commande |
| GET | `/api/commandes/:id` | Récupérer une commande |
| POST | `/api/livraison` | Sauvegarder une adresse de livraison |
| GET | `/api/livraison` | Récupérer l'adresse sauvegardée |

---

## 🌿 Conventions Git

### Branches

| Branche | Usage |
|---------|-------|
| `main` | Code stable, version finale |
| `dev` | Branche de développement commune |
| `feat/nom-fonctionnalite` | Nouvelle fonctionnalité |
| `fix/nom-du-bug` | Correction de bug |

### Exemples de noms de commits

```
feat: affichage catalogue avec fetch API
feat: carrousel d images avec miniatures
feat: ajout produit au panier localStorage
fix: correction calcul prix avec reduction
fix: bug affichage stock a zero
style: responsive mobile page catalogue
docs: mise a jour README installation
```

### Workflow utilisé

```bash
# Créer une nouvelle branche pour chaque fonctionnalité
git checkout -b feat/catalogue-filtres

# Travailler, puis commiter régulièrement
git add .
git commit -m "feat: ajout filtre par couleur sur le catalogue"

# Pousser sur GitHub
git push origin feat/catalogue-filtres

# Fusionner dans dev une fois terminé
git checkout dev
git merge feat/catalogue-filtres
```

*Projet réalisé à Ynov Campus Sophia — Module Challenge JS*
