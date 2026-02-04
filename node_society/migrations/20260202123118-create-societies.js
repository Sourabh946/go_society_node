'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('societies', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // ✅ DB-level UNIQUE
      },
      address: Sequelize.TEXT,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // ✅ Explicit index (recommended even with UNIQUE)
    await queryInterface.addIndex(
      'societies',
      ['name'],
      {
        name: 'idx_societies_name',
        unique: true
      }
    );

    await queryInterface.addIndex(
      'societies',
      ['registration_no', 'deleted_at'],
      {
        unique: true,
        name: 'uq_society_reg_no_active'
      }
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('societies');
  }
};
