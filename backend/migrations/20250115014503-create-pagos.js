'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('pagos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      propietario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'propietarios', // Nombre de la tabla de referencia
          key: 'id',         },
        allowNull: false,
        onDelete: 'CASCADE', 
        onUpdate: 'CASCADE', 
      },
      monto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      fecha_pago: {
        type: Sequelize.DATEONLY, // Solo la fecha
        allowNull: false,
      },
      concepto: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'pagado', 'vencido'),
        defaultValue: 'pendiente',
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        onUpdate: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('pagos');
  }
};
