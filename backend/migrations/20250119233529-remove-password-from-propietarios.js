'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Propietarios', 'password');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Propietarios', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
