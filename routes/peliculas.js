const express = require('express');
const router = express.Router();
const db = require('../db');

// Crear película
router.post('/', async (req, res) => {
  const { nombre, imagen, descripcion, duracion, clasificacion } = req.body;

  if (!nombre || !duracion || !clasificacion) {
    return res.status(400).json({ msg: 'Faltan campos obligatorios' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO pelicula (nombre, imagen, descripcion, duracion, clasificacion) VALUES (?, ?, ?, ?, ?)',
      [nombre, imagen || '', descripcion || '', duracion, clasificacion]
    );
    res.json({ msg: 'Película creada', id: result.insertId });
  } catch (error) {
    console.error('Error al crear película:', error);
    res.status(500).json({ msg: 'Error al crear película' });
  }
});

// Obtener todas las películas
router.get('/', async (req, res) => {
  try {
    const [peliculas] = await db.execute('SELECT * FROM pelicula');
    res.json(peliculas);
  } catch (error) {
    console.error('Error al obtener películas:', error);
    res.status(500).json({ msg: 'Error al obtener películas' });
  }
});

module.exports = router;


