const mysql = require('mysql2/promise');
require('dotenv').config();

// Création du pool de connexion MySQL (marche avec ou sans le .env(valeur par défaut))
const db = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASS || '',
	database: process.env.DB_NAME || 'boutique_auto',

	waitForConnections: true,
	connectionLimit: 2,
	queueLimit: 0,

	charset: 'utf8mb4'
});

// Test de connexion
(async () => {
	try {
		// Test de connexion et libertion immédiate de la connexion
		const connection = await db.getConnection();
		console.log('Connecté à MySQL !! = http://localhost:3000');
		connection.release();
	} catch (error) {
		// En cas d'erreur de connexion, on affiche un message d'erreur dans la console
		console.error('Erreur connexion MySQL:', error.message);
	}
})();

module.exports = db;

