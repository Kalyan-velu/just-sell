import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export async function up(
  queryInterface: QueryInterface,
  SequelizeLib: typeof Sequelize
) {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: SequelizeLib.literal('gen_random_uuid()'),
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isOnboard: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: SequelizeLib.literal('CURRENT_TIMESTAMP'),
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: SequelizeLib.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: SequelizeLib.literal('CURRENT_TIMESTAMP'),
    },
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('users');
}
