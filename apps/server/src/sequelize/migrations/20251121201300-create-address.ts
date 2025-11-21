import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export async function up(queryInterface: QueryInterface, SequelizeLib: typeof Sequelize) {
  await queryInterface.createTable('address', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: SequelizeLib.literal('gen_random_uuid()'),
    },
    addressLine1: { type: DataTypes.STRING, allowNull: false },
    addressLine2: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, allowNull: false, defaultValue: 'india' },
    pinCode: { type: DataTypes.STRING, allowNull: false },
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('address');
}
