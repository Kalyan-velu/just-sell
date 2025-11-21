import 'dotenv/config';
import { SequelizeStorage, Umzug } from 'umzug';
import { Sequelize } from 'sequelize';
import getConfiguration from './config/configuration';

const config = getConfiguration();

// Create a Sequelize instance with explicit postgres dialect
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.pg.host,
  port: config.pg.port,
  username: config.pg.username,
  password: config.pg.password,
  database: config.pg.database,
  logging: false,
});

export const migrator = new Umzug({
  migrations: {
    // support both TS (when using ts-node) and JS migrations
    glob: ['sequelize/migrations/*.{ts,js}', { cwd: __dirname }],
    // Allow running legacy sequelize-cli style migrations by adapting signature
    resolve: ({ name, path, context }) => {
      if (!path) throw new Error(`Migration path missing for ${name}`);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const migrationModule = require(path);
      const migration = migrationModule?.default ?? migrationModule;
      return {
        name,
        up: async () => {
          if (typeof migration.up === 'function') {
            return migration.up(context, Sequelize);
          }
        },
        down: async () => {
          if (typeof migration.down === 'function') {
            return migration.down(context, Sequelize);
          }
        },
      };
    },
  },
  // Umzug expects QueryInterface as context for sequelize migrations
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize,
    tableName: 'migrations',
  }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;
