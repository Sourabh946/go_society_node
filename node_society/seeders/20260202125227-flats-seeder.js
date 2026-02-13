'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('flats', [
      {
        id: 1,
        flat_number: 'A-101',
        building_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        flat_number: 'A-102',
        building_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        flat_number: 'B-201',
        building_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('flats', null, {});
  }
};
