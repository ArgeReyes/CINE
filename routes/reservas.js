const express = require('express');
const router = express.Router();
const db = require('../db');

// Crear reserva
router.post('/', async (req, res) => {
  const { salaId, userId } = req.body;

  if (!salaId || !userId) {
    return res.status(400).json({ msg: 'Faltan datos necesarios' });
  }

  try {
    // Verificar que el usuario no haya reservado ya en esta sala (opcional)
    const [existing] = await db.execute(
      'SELECT * FROM reservacion WHERE id_usuario = ? AND id_sala = ?',
      [userId, salaId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ msg: 'Ya tienes una reserva en esta sala' });
    }

    await db.execute(
      'INSERT INTO reservacion (id_usuario, id_sala) VALUES (?, ?)',
      [userId, salaId]
    );
    res.json({ msg: 'Reserva realizada con éxito' });
  } catch (err) {
    console.error('Error al crear reserva:', err);
    res.status(500).json({ msg: 'Error al reservar' });
  }
});

// Obtener reservas por sala
router.get('/', async (req, res) => {
  const { salaId } = req.query;
  if (!salaId) return res.status(400).json({ msg: 'Falta id de sala' });

  try {
    const [reservas] = await db.execute(
      'SELECT * FROM reservacion WHERE id_sala = ?',
      [salaId]
    );
    res.json(reservas);
  } catch (err) {
    console.error('Error al obtener reservas:', err);
    res.status(500).json({ msg: 'Error al obtener reservas' });
  }
});

module.exports = router;
