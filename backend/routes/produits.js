const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const { marque } = req.query;

		if (marque) {
			const [rows] = await db.query('SELECT * FROM produits WHERE marque = ? ORDER BY id DESC', [marque]);
			return res.json(rows);
		}

		const [rows] = await db.query('SELECT * FROM produits ORDER BY id DESC');
		return res.json(rows);
	} catch (error) {
		return res.status(500).json({ message: 'Erreur serveur', error: error.message });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const [rows] = await db.query('SELECT * FROM produits WHERE id = ?', [id]);

		if (rows.length === 0) {
			return res.status(404).json({ message: 'Produit introuvable' });
		}

		return res.json(rows[0]);
	} catch (error) {
		return res.status(500).json({ message: 'Erreur serveur', error: error.message });
	}
});

router.post('/', async (req, res) => {
	try {
		const {
			ref,
			nom,
			description,
			prix,
			reduction = 0,
			stock = 0,
			marque,
			couleur_principale = null,
			couleur_secondaire = null,
			categorie_id = null,
		} = req.body;

		if (!ref || !nom || !description || prix === undefined || !marque) {
			return res.status(400).json({
				message: 'Champs obligatoires: ref, nom, description, prix, marque',
			});
		}

		const [result] = await db.query(
			`INSERT INTO produits
			(ref, nom, description, prix, reduction, stock, marque, couleur_principale, couleur_secondaire, categorie_id)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				ref,
				nom,
				description,
				prix,
				reduction,
				stock,
				marque,
				couleur_principale,
				couleur_secondaire,
				categorie_id,
			]
		);

		const [rows] = await db.query('SELECT * FROM produits WHERE id = ?', [result.insertId]);
		return res.status(201).json(rows[0]);
	} catch (error) {
		return res.status(500).json({ message: 'Erreur serveur', error: error.message });
	}
});

module.exports = router;
