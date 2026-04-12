const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const produitsRoutes = require('./routes/produits');
const registerRoutes = require('./routes/back_register');
const loginRoutes = require('./routes/back_login');

const app = express();
const port = process.env.PORT || 3000;

// 1. Middlewares en premier
app.use(cors());
app.use(express.json());

// 2. Routes API
app.use('/api/produits', produitsRoutes);
app.use('/api/utilisateurs', registerRoutes);
app.use('/api/utilisateurs', loginRoutes);

// 3. Fichiers statiques
app.use(express.static(path.join(__dirname, '../frontend')));

// 4. Catch-all 404 — toujours en dernier
app.use((req, res) => {
  res.status(404).sendFile(path.join(process.env.FRONTEND_PATH, 'pages/404.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});