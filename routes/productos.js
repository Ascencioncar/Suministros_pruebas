const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET - Obtener todos los productos
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM producto');
  res.json(result.rows);
});

// GET - Obtener producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM producto WHERE id = $1', [id]);
  res.json(result.rows[0]);
});

// POST - Crear producto
router.post('/', async (req, res) => {
  const { nombre, descripcion, creado_por } = req.body;
  const result = await pool.query(
    'INSERT INTO producto (nombre, descripcion, creado_por) VALUES ($1, $2, $3) RETURNING *',
    [nombre, descripcion, creado_por]
  );
  res.status(201).json(result.rows[0]);
});

// PUT - Actualizar producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, creado_por } = req.body;
  const result = await pool.query(
    'UPDATE producto SET nombre = $1, descripcion = $2, creado_por = $3 WHERE id = $4 RETURNING *',
    [nombre, descripcion, creado_por, id]
  );
  res.json(result.rows[0]);
});

// DELETE - Eliminar producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM producto WHERE id = $1', [id]);
  res.json({ mensaje: 'Producto eliminado correctamente' });
});

module.exports = router;
