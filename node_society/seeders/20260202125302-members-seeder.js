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
    await queryInterface.bulkInsert('members', [
      {
        id: 1,
        user_id: 1,     // admin user
        flat_id: 1,
        role: 'owner',
        from_date: '2024-01-01',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 2,        // John Member
        flat_id: 2,        // A-101
        role: 'owner',
        from_date: '2024-01-01',
        is_active: true,
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
    await queryInterface.bulkDelete('members', null, {});
  }
};
