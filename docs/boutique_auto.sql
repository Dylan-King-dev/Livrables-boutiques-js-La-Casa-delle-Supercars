-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : sam. 11 avr. 2026 à 22:57
-- Version du serveur : 5.7.24
-- Version de PHP : 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `boutique_auto`
--

-- --------------------------------------------------------

--
-- Structure de la table `produits`
--

CREATE TABLE `produits` (
  `id` int(11) NOT NULL,
  `ref` varchar(50) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `prix` decimal(15,2) DEFAULT NULL,
  `reduction` int(11) NOT NULL DEFAULT '0',
  `stock` int(11) NOT NULL DEFAULT '0',
  `marque` varchar(100) NOT NULL,
  `puissance` int(11) NOT NULL,
  `annee` int(11) NOT NULL,
  `zero_a_cent` decimal(5,2) NOT NULL,
  `couleur_principale` varchar(50) DEFAULT NULL,
  `couleur_secondaire` varchar(50) DEFAULT NULL,
  `categorie_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `produits`
--

INSERT INTO `produits` (`id`, `ref`, `nom`, `description`, `prix`, `reduction`, `stock`, `marque`, `puissance`, `annee`, `zero_a_cent`, `couleur_principale`, `couleur_secondaire`, `categorie_id`) VALUES
(1, 'MAS-GTF-001', 'Granturismo Folgore', 'Coupé électrique haut de gamme très performant.', '195000.00', 5, 2, 'Maserati', 761, 2024, '2.70', 'Noir', 'Rouge', 5),
(2, 'MAS-GRF-001', 'Grecale Folgore', 'SUV électrique luxueux et moderne.', '125000.00', 0, 3, 'Maserati', 500, 2024, '4.10', 'Noir', 'Vert Fluo', 5),
(3, 'MAS-GT-001', 'Gran Turismo', 'Coupé sportif iconique au design élégant.', '160000.00', 10, 2, 'Maserati', 550, 2023, '3.50', 'Noir', 'Bleu', 1),
(4, 'MAS-TRO-001', 'Trofeo', 'Version ultra performante avec moteur puissant.', '180000.00', 5, 1, 'Maserati', 580, 2023, '3.20', 'Noir', 'Orange', 1),
(5, 'MAS-GC-001', 'Grancabrio', 'Cabriolet sportif pour conduite plaisir.', '170000.00', 8, 2, 'Maserati', 540, 2023, '3.80', 'Noir', 'Or', 3),
(6, 'MAS-GCT-001', 'Grancabrio Trofeo', 'Version cabriolet haute performance.', '190000.00', 3, 1, 'Maserati', 580, 2024, '3.40', 'Noir', 'Gris', 3),
(7, 'MAS-GT2-001', 'GT2 Stradale', 'Voiture extrême inspirée de la compétition.', '220000.00', 0, 1, 'Maserati', 640, 2024, '2.80', 'Noir', 'Jaune', 2),
(8, 'MAS-MCP-001', 'MCPura', 'Supercar légère et ultra performante.', '250000.00', 0, 1, 'Maserati', 630, 2024, '2.90', 'Noir', 'Blanc', 2),
(9, 'MAS-GRE-001', 'Grecale', 'SUV compact sportif et confortable.', '95000.00', 12, 4, 'Maserati', 300, 2023, '5.60', 'Noir', 'Violet', 4),
(10, 'MAS-GRM-001', 'Grecale Modena', 'Version améliorée avec plus de puissance.', '105000.00', 7, 3, 'Maserati', 330, 2023, '5.30', 'Noir', 'Emeraude', 4),
(11, 'POR-718SRS-001', '718 Spyder RS', 'Roadster sportif radical avec excellente tenue de route.', '185000.00', 4, 2, 'Porsche', 500, 2024, '3.40', 'Argent', 'Jaune', 1),
(12, 'POR-911CRS-001', '911 Carrera RS', 'Coupé emblématique au caractère sportif affirmé.', '165000.00', 6, 2, 'Porsche', 450, 2023, '3.70', 'Argent', 'Rouge', 1),
(13, 'POR-PAN-001', 'Panamera', 'Berline de luxe alliant confort et performance.', '122000.00', 8, 3, 'Porsche', 353, 2023, '5.10', 'Blanc', 'Bleu', 5),
(14, 'POR-CEH-001', 'Cayenne E-Hybrid', 'SUV hybride rechargeable puissant et polyvalent.', '108000.00', 5, 4, 'Porsche', 470, 2024, '4.90', 'Blanc', 'Marron', 3),
(15, 'POR-CE-001', 'Cayenne Electric', 'SUV électrique moderne avec grande autonomie.', '118000.00', 3, 3, 'Porsche', 408, 2025, '4.70', 'Gris', 'Vert', 4),
(16, 'POR-MAC-001', 'Macan', 'SUV compact dynamique pour un usage quotidien premium.', '78000.00', 10, 5, 'Porsche', 265, 2023, '6.20', 'Blanc', 'Orange', 3),
(17, 'POR-TTG-001', 'Taycan Turbo GT', 'Berline électrique ultra performante et technologique.', '210000.00', 2, 1, 'Porsche', 789, 2024, '2.30', 'Blanc', 'Bleu Metal', 4),
(18, 'POR-718CGT4RS-001', '718 Cayman GT4 RS', 'Coupé léger et radical orienté circuit.', '195000.00', 0, 2, 'Porsche', 500, 2024, '3.20', 'Argent', 'Bleu', 2),
(19, 'POR-911GT3-001', '911 GT3', 'Version extrême de la 911 conçue pour la performance.', '225000.00', 0, 1, 'Porsche', 510, 2024, '3.10', 'Argent', 'Jaune', 2),
(20, 'POR-911TS-001', '911 Turbo S', 'Supercar polyvalente avec accélérations impressionnantes.', '245000.00', 1, 1, 'Porsche', 650, 2024, '2.70', 'Argent', 'Noir', 2);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `produits`
--
ALTER TABLE `produits`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ref` (`ref`),
  ADD KEY `categorie_id` (`categorie_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `produits`
--
ALTER TABLE `produits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `produits`
--
ALTER TABLE `produits`
  ADD CONSTRAINT `produits_ibfk_1` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
