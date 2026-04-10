CREATE DATABASE IF NOT EXISTS boutique_auto
	CHARACTER SET utf8mb4
	COLLATE utf8mb4_unicode_ci;

USE boutique_auto;

CREATE TABLE IF NOT EXISTS categories (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nom VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS utilisateurs (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nom VARCHAR(100) NOT NULL,
	prenom VARCHAR(100),
	email VARCHAR(190) NOT NULL UNIQUE,
	mot_de_passe VARCHAR(255) NOT NULL,
	role ENUM('client', 'admin') NOT NULL DEFAULT 'client'
);

CREATE TABLE IF NOT EXISTS produits (
	id INT AUTO_INCREMENT PRIMARY KEY,
	ref VARCHAR(50) NOT NULL UNIQUE,
	nom VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	prix DECIMAL(10,2) NOT NULL,
	reduction INT NOT NULL DEFAULT 0,
	stock INT NOT NULL DEFAULT 0,
	marque ENUM('Maserati', 'Porsche') NOT NULL,
	couleur_principale VARCHAR(50),
    couleur_secondaire VARCHAR(50),
	categorie_id INT NULL,
	CONSTRAINT fk_produits_categories
		FOREIGN KEY (categorie_id) REFERENCES categories(id)
		ON DELETE SET NULL
		ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS commandes (
	id INT AUTO_INCREMENT PRIMARY KEY,
	total DECIMAL(10,2) NOT NULL,
	adresse_livraison TEXT NOT NULL,
	user_id INT NULL,
	CONSTRAINT fk_commandes_user
		FOREIGN KEY (user_id) REFERENCES utilisateurs(id)
		ON DELETE SET NULL
		ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS commande_items (
	id INT AUTO_INCREMENT PRIMARY KEY,
	commande_id INT NOT NULL,
	produit_id INT NOT NULL,
	quantite INT NOT NULL,
	prix_unitaire DECIMAL(10,2) NOT NULL,
	CONSTRAINT fk_commande_items_commandes
		FOREIGN KEY (commande_id) REFERENCES commandes(id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_commande_items_produits
		FOREIGN KEY (produit_id) REFERENCES produits(id)
		ON DELETE RESTRICT
		ON UPDATE CASCADE
);

INSERT INTO categories (nom)
VALUES
	('Sport'),
	('Super Sport'),
	('SUV'),
	('Electrique'),
	('Classic')
ON DUPLICATE KEY UPDATE nom = VALUES(nom);
