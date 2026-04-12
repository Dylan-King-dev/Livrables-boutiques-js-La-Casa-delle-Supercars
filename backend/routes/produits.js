const express = require('express');
const db = require('../db');

const router = express.Router();

// 1. GET tous les produits
router.get('/', async (req, res) => {
	try {
		const { marque, search } = req.query;

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

		if (search) {
			query += ' AND (p.nom LIKE ? OR p.description LIKE ?)';
			params.push(`%${search}%`, `%${search}%`);
		}

		query += ' ORDER BY p.id DESC';

		const [rows] = await db.query(query, params);
		return res.json(rows);
	} catch (error) {
		return res.status(500).json({ message: 'Erreur serveur', error: error.message });
	}
});

// 2. GET suggestions (avant /:id obligatoirement)
router.get('/search/suggestions', async (req, res) => {
	try {
		const { q } = req.query;

		if (!q || q.length < 2) {
			return res.json([]);
		}

		const [rows] = await db.query(`
			SELECT p.id, p.nom, p.marque, p.prix, p.reduction
			FROM produits p
			WHERE p.nom LIKE ? OR p.description LIKE ?
			ORDER BY 
				CASE 
					WHEN p.nom LIKE ? THEN 1
					ELSE 2
				END,
				p.nom
			LIMIT 8
		`, [`%${q}%`, `%${q}%`, `${q}%`]);

		return res.json(rows);
	} catch (error) {
		return res.status(500).json({ message: 'Erreur serveur', error: error.message });
	}
});

// 3. POST nouveau produit
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

// 4. PATCH decrement stock (avant /:id obligatoirement)
router.patch('/:id/decrement-stock', async (req, res) => {
	try {
		const { id } = req.params;
		const quantity = Number(req.body.quantity) || 1;

		const [rows] = await db.query('SELECT stock FROM produits WHERE id = ?', [id]);
		if (rows.length === 0) {
			return res.status(404).json({ message: 'Produit introuvable' });
		}

		const newStock = Math.max(rows[0].stock - quantity, 0);
		await db.query('UPDATE produits SET stock = ? WHERE id = ?', [newStock, id]);

		return res.json({ ok: true, newStock });
	} catch (error) {
		return res.status(500).json({ message: 'Erreur serveur', error: error.message });
	}
});

// 5. GET produit par id (toujours en dernier)
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

module.exports = router;