// les variable 
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
// import des route page du site
const produitsRoutes = require('./routes/produits');
const registerRoutes = require('./routes/back_register');
const loginRoutes = require('./routes/back_login');
// on creer le port ou on veux envoyer les requete :)
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes API (endpoints (fin URL aprés http://localhost:3000 ex:http://localhost:3000/api/produits affiche tout les produit de la table produits))
app.use('/api/produits', produitsRoutes);
app.use('/api/utilisateurs', registerRoutes);
app.use('/api/utilisateurs', loginRoutes);


// Démarrage du serveur
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});