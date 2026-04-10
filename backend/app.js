const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const produitsRoutes = require('./routes/produits');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/produits', produitsRoutes);

app.get('/', (req, res) => {
	res.json({ message: 'Backend La Casa delle Supercars is running' });
});

app.get('/health', async (req, res) => {
    const mysql = require('mysql2/promise');
    try {
        const conn = await mysql.createConnection({
            host: '127.0.0.1',
            port: 3306,
            user: 'root',
            password: 'root',
            database: 'boutique_auto',
        });
        await conn.query('SELECT 1');
        await conn.end();
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        console.error('Health error:', error.message);
        res.status(500).json({ status: 'error', database: 'disconnected', message: error.message });
    }
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
