'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // enable pgcrypto for gen_random_uuid()
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')

    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      phone: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      isOnboard: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      timestamp: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('now()')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('now()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('now()')
      }
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users')
  }
}
