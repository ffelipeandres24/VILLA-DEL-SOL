const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const { port } = require('./src/config/config');
const db = require('./models');

const authRoutes = require('./src/routes/authRoutes');
const propietarioRoutes = require('./src/routes/propietarioRoutes');
const apartamentoRoutes = require('./src/routes/apartamentoRoutes');
const pagoRoutes = require('./src/routes/pagoRoutes');
const visitanteRoutes = require('./src/routes/visitanteRoutes');

const PORT = process.env.PORT || port || 4000;

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/propietarios', propietarioRoutes);
app.use('/api/apartamentos', apartamentoRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/visitantes', visitanteRoutes);

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada con éxito');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al sincronizar las tablas:', err);
  });
