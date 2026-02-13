'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('societies', { id: Sequelize.BIGINT });
     */
    await queryInterface.createTable('societies', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // ✅ DB-level UNIQUE
      },

      reg_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // ✅ DB-level UNIQUE
      },
      address: Sequelize.TEXT,
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
      ['reg_no', 'deleted_at'],
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
     * await queryInterface.dropTable('societies');
     */
    await queryInterface.dropTable('societies');
  }
};
