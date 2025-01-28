'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');
const Visitante = require('./visitante'); // Importa el modelo Visita

const Apartamento = sequelize.define('Apartamento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bloque: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  metros_cuadrados: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  propietario_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Propietarios',
      key: 'id',
    },
  },
}, {
  timestamps: false,
});

// Relación con Visitante
Apartamento.hasMany(Visitante, { foreignKey: 'apartamento_id' });
Visitante.belongsTo(Apartamento, { foreignKey: 'apartamento_id' });

module.exports = Apartamento;
