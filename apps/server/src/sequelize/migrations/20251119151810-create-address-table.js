'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('address', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      addressLine1: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      addressLine2: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      state: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      country: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'india'
      },
      pinCode: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      }
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('address')
  }
}
