const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ GET - Listar inventario con nombres de producto y bodega
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.id, 
             p.nombre AS producto, 
             b.nombre AS bodega, 
             i.cantidad, 
             i.ultima_actualizacion
      FROM inventario i
      JOIN producto p ON i.producto_id = p.id
      JOIN bodega b ON i.bodega_id = b.id
      ORDER BY b.nombre, p.nombre
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el inventario' });
  }
});

// ✅ GET - Inventario de un producto en una bodega específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT i.id, 
             p.nombre AS producto, 
             b.nombre AS bodega, 
             i.cantidad, 
             i.ultima_actualizacion
      FROM inventario i
      JOIN producto p ON i.producto_id = p.id
      JOIN bodega b ON i.bodega_id = b.id
      WHERE i.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Inventario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el inventario' });
  }
});

// ✅ POST - Crear registro de inventario
router.post('/', async (req, res) => {
  try {
    const { producto_id, bodega_id, cantidad } = req.body;

    const result = await pool.query(`
      INSERT INTO inventario (producto_id, bodega_id, cantidad)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [producto_id, bodega_id, cantidad]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar inventario' });
  }
});

// ✅ PUT - Actualizar cantidad de inventario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    const result = await pool.query(`
      UPDATE inventario 
      SET cantidad = $1, ultima_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [cantidad, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Inventario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar inventario' });
  }
});

// ✅ DELETE - Eliminar un registro de inventario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM inventario WHERE id = $1', [id]);
    res.json({ mensaje: 'Inventario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar inventario' });
  }
});

module.exports = router;
