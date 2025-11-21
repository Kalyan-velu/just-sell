import { QueryInterface, Sequelize } from 'sequelize';

export async function up(queryInterface: QueryInterface, _Sequelize: typeof Sequelize) {
  // Enable pgcrypto to use gen_random_uuid() for UUID defaults
  await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
}

export async function down(queryInterface: QueryInterface, _Sequelize: typeof Sequelize) {
  await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "pgcrypto";');
}
