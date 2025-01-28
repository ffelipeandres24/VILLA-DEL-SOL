'use strict';
module.exports = (sequelize, DataTypes) => {
  const Administrador = sequelize.define(
    'Administrador',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'administradores',
      timestamps: false,
    }
  );

  return Administrador;
};
