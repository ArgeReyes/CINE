const express = require('express');
const router = express.Router();
const db = require('../db');

// Crear sala
router.post('/', async (req, res) => {
  const { nombre, capacidad, filas, columnas, id_usuario, id_pelicula } = req.body;

  if (!nombre || !capacidad || !filas || !columnas) {
    return res.status(400).json({ msg: 'Faltan datos obligatorios' });
  }

  const usuarioFinal = id_usuario || 1; // Default 1

  try {
    const [result] = await db.execute(
      'INSERT INTO sala (nombre, capacidad, filas, columnas, id_usuario, id_pelicula) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, capacidad, filas, columnas, usuarioFinal, id_pelicula || null]
    );
    res.json({ msg: 'Sala creada', id: result.insertId });
  } catch (error) {
    console.error('Error al crear sala:', error);
    res.status(500).json({ msg: 'Error al crear sala' });
  }
});

// Listar todas las salas
router.get('/', async (req, res) => {
  try {
    const [salas] = await db.execute(
      `SELECT sala.*, pelicula.nombre AS pelicula_nombre 
       FROM sala LEFT JOIN pelicula ON sala.id_pelicula = pelicula.id`
    );
    res.json(salas);
  } catch (error) {
    console.error('Error listar salas:', error);
    res.status(500).json({ msg: 'Error al listar salas' });
  }
});

// Obtener sala por id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await db.execute(
      `SELECT sala.*, pelicula.nombre AS pelicula_nombre 
       FROM sala LEFT JOIN pelicula ON sala.id_pelicula = pelicula.id
       WHERE sala.id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ msg: 'Sala no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error obtener sala:', error);
    res.status(500).json({ msg: 'Error al obtener sala' });
  }
});

module.exports = router;



