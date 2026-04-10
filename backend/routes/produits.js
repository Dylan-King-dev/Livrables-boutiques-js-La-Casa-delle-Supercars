const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const { marque } = req.query;

		let query = `
			SELECT p.*, c.nom AS categorie_nom
			FROM produits p
			LEFT JOIN categories c ON p.categorie_id = c.id
			WHERE 1=1
		`;
		let params = [];

		if (marque) {
			query += ' AND p.marque = ?';
			params.push(marque);
		}

		query += ' ORDER BY p.id DESC';

		const [rows] = await db.query(query, params);
		return res.json(rows);
	} catch (error) {
		return res.status(500).json({ message: 'Erreur serveur', error: error.message });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const [rows] = await db.query(`
			SELECT p.*, c.nom AS categorie_nom
			FROM produits p
			LEFT JOIN categories c ON p.categorie_id = c.id
			WHERE p.id = ?
		`, [id]);

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
