const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET - obtener todos los usuarios
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM usuario');
  res.json(result.rows);
});

// GET - obtener un solo usuario por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM usuario WHERE id = $1', [id]);
  res.json(result.rows[0]);
});

// POST - crear un nuevo usuario
router.post('/', async (req, res) => {
  const { nombre, correo, contrasena, rol } = req.body;
  const result = await pool.query(
    'INSERT INTO usuario (nombre, correo, contrasena, rol) VALUES ($1, $2, $3, $4) RETURNING *',
    [nombre, correo, contrasena, rol]
  );
  res.status(201).json(result.rows[0]);
});

// PUT - actualizar un usuario
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, contrasena, rol } = req.body;
  const result = await pool.query(
    'UPDATE usuario SET nombre = $1, correo = $2, contrasena = $3, rol = $4 WHERE id = $5 RETURNING *',
    [nombre, correo, contrasena, rol, id]
  );
  res.json(result.rows[0]);
});

// DELETE - eliminar un usuario
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM usuario WHERE id = $1', [id]);
  res.json({ mensaje: 'Usuario eliminado correctamente' });
});

module.exports = router;
