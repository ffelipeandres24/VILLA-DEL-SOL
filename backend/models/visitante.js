'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');

const Visitante = sequelize.define('Visitante', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  apartamento_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Apartamentos',
      key: 'id',
    },
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  documento: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_entrada: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_salida: {
    type: DataTypes.DATE,
  },
  estado: {
    type: DataTypes.ENUM('activo', 'finalizado'),
    defaultValue: 'activo',
  },
  motivo_visita: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: false,
});

module.exports = Visitante;
