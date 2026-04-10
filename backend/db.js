console.log('ENV PATH:', path.join(__dirname, '.env'));
console.log('DB_PASS loaded:', process.env.DB_PASS);
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const db = mysql.createPool({
	host: process.env.DB_HOST || 'localhost',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASS || '',
	database: process.env.DB_NAME || 'boutique_auto',
	waitForConnections: true,
	connectionLimit: 1,
	queueLimit: 0,
	charset: 'utf8mb4',
});

module.exports = db;
