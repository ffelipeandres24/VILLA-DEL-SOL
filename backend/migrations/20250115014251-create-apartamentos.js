'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('apartamentos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bloque: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      metros_cuadrados: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      propietario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'propietarios',
          key: 'id', 
        },
        allowNull: true, 
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
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
    await queryInterface.dropTable('apartamentos');
  }
};
