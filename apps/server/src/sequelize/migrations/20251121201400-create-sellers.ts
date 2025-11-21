import { QueryInterface, DataTypes, Sequelize } from 'sequelize';

export async function up(queryInterface: QueryInterface, SequelizeLib: typeof Sequelize) {
  await queryInterface.createTable('sellers', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: SequelizeLib.literal('gen_random_uuid()'),
    },
    name: { type: DataTypes.STRING, allowNull: false },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    address: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: 'address', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('sellers');
}
