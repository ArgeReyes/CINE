const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const salasRoutes = require('./routes/salas');
const reservasRoutes = require('./routes/reservas');
const peliculasRouter = require('./routes/peliculas');

app.use('/api/peliculas', peliculasRouter);
app.use('/api/reservas', reservasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/salas', salasRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
