const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const db = require('../db');

// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  try {
    const hashed = await bcrypt.hash(contraseña, 10);
    const [rows] = await db.execute(
      'INSERT INTO usuario (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hashed, false]
    );
    res.json({ msg: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);  
    res.status(500).json({ msg: 'Error al registrar' });
  }
});



// Login de usuario
router.post('/login', async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM usuario WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ msg: 'Usuario no encontrado' });
    }
    console.log("Contraseña enviada:", contraseña);
    console.log("Hash guardado en DB:", user.contraseña);

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, rol: user.rol }, 'secreto', { expiresIn: '1h' });

    res.json({ msg: 'Login exitoso', token });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ msg: 'Error al iniciar sesión' });
  }
});


module.exports = router;

