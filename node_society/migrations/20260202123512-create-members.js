'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('members', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      flat_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'flats',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },

      role: {
        type: Sequelize.ENUM('owner', 'tenant'),
        allowNull: false
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      from_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      to_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })

    await queryInterface.addIndex('members', ['flat_id'])
    await queryInterface.addIndex('members', ['user_id'])
  },

  async down(queryInterface) {
    await queryInterface.dropTable('members')
  }
}