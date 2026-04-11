const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({
        message: 'Email et mot de passe obligatoires'
      });
    }

    const [users] = await db.query(
      'SELECT * FROM utilisateurs WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    const user = users[0];
    const storedPassword = user.mot_de_passe || user.mot_de_passe_encode;

    if (!storedPassword) {
      return res.status(500).json({
        message: 'Colonne mot de passe introuvable en base'
      });
    }

    const isBcryptHash = /^\$2[aby]\$/.test(String(storedPassword));

    let isPasswordValid = false;
    if (isBcryptHash) {
      isPasswordValid = await bcrypt.compare(mot_de_passe, storedPassword);
    } else {
      // Compatibilite pour d'anciens comptes stockes en clair.
      isPasswordValid = mot_de_passe === String(storedPassword);
    }

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    res.status(200).json({
      message: 'Connexion réussie',
      utilisateur: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;