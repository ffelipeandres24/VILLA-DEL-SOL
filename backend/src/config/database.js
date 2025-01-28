const { Sequelize } = require('sequelize');
require('dotenv').config();


// Configuración de la base de datos
const sequelize = new Sequelize('villa_del_sol', 'root', 'andres24', {
  host: 'localhost',
  dialect: 'mysql',
});

// Función para probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente  .');
    } catch (error) {
        console.error(' Error al conectar a la base de datos', error);
    }
};


testConnection();

module.exports = sequelize;