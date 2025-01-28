'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');

const Pago = sequelize.define('Pago', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  propietario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Propietarios',
      key: 'id',
    },
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  fecha_pago: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  concepto: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'pagado', 'vencido'),
    defaultValue: 'pendiente',
  },
}, {
  timestamps: false,
});

module.exports = Pago;
