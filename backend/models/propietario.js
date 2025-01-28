'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/database');

// Importar los modelos necesarios
const Apartamento = require('./apartamento');
const Pago = require('./pago');

const Propietario = sequelize.define('Propietario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
}, {
  timestamps: false,
});

// Relación con Apartamento
Propietario.hasMany(Apartamento, { foreignKey: 'propietario_id' });
Apartamento.belongsTo(Propietario, { foreignKey: 'propietario_id' });

// Relación con Pago
Propietario.hasMany(Pago, { foreignKey: 'propietario_id' });
Pago.belongsTo(Propietario, { foreignKey: 'propietario_id' });

module.exports = Propietario;
