const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const produitsRoutes = require('./routes/produits');
const registerRoutes = require('./routes/back_register');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/produits', produitsRoutes);
app.use('/api/utilisateurs', registerRoutes);

// Routes test
app.get('/', (req, res) => {
	res.json({ message: 'Backend La Casa delle Supercars is running' });
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});