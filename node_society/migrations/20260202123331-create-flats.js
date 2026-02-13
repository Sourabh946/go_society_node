'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.BIGINT });
     */
    await queryInterface.createTable('flats', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      flat_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
      building_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'buildings',
          key: 'id'
        },
        // onDelete: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addIndex(
      'flats',
      ['building_id', 'flat_number'],
      {
        unique: true,
        name: 'uq_building_flat'
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
    await queryInterface.dropTable('flats');
  }
};
