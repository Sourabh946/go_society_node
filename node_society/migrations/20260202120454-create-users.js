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
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: Sequelize.STRING,
      role_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'roles',
          key: 'id'
        },
        onDelete: 'SET NULL'
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
      'users',
      ['email'],
      {
        name: 'idx_users_email',
        unique: true
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
    await queryInterface.dropTable('users');
  }
};
