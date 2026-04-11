const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db'); // ton fichier de connexion MySQL

// INSCRIPTION D'UN NOUVELLE UTILISATEUR
router.post('/register', async (req, res) => {
  try {
    const { 
        nom, 
        prenom, 
        email, 
        mot_de_passe 
    } = req.body;

    // On vérifie que tous les champs sont présents pour la création de l'utilisateur
    if (!nom || !prenom || !email || !mot_de_passe) 
    {
      return res.status(400).json({
        message: 'Tous les champs sont obligatoires'
      });
    }

    // on vérifie que l'email n'est pas déjà utilisé
    const [existingUser] = await db.query(
      'SELECT id FROM utilisateurs WHERE email = ?',
      [email]
    );
    // Si un utilisateur avec cet email existe déjà, on retourne un erreur avec message
    if (existingUser.length > 0) {
      return res.status(409).json({
        message: 'Cet email est déjà utilisé'
      });
    }

    // Encryption du mot de passe avant de le stocker dans la base de données
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Insertion du nouvel utilisateur avec compatibilite entre les deux noms de colonne possibles.
    let result;
    try {
      [result] = await db.query(
        `INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role)
         VALUES (?, ?, ?, ?, ?)`,
        [nom, prenom, email, hashedPassword, 'client']
      );
    } catch (error) {
      if (error && error.code === 'ER_BAD_FIELD_ERROR') {
        [result] = await db.query(
          `INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe_encode, role)
           VALUES (?, ?, ?, ?, ?)`,
          [nom, prenom, email, hashedPassword, 'client']
        );
      } else {
        throw error;
      }
    }
    // On retourne une réponse avec un message qui informe que l'utilisateur a était créer 
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      utilisateur: {
        id: result.insertId,
        nom,
        prenom,
        email,
        role: 'client'
      }
    });
    // Si une erreur arrive pendant l'éxecution de la commande , on l'affiche.
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur serveur'
    });
  }
});

// Récupérer tous les utilisateurs est les affiche dans la console du serveur (pour les tests) quand je cherche parceque jai pas de tete 
router.get('/', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, nom, prenom, email, role FROM utilisateurs');

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;