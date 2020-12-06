const data = require('./seedFiles/data');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('data', data, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('data', null, {});
  },
};
