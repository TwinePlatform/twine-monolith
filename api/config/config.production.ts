import * as path from 'path';
import { Environment } from './types';

export default {
  env: Environment.PRODUCTION,
  web: {
    port: 4002,
  },
  knex: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 3,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, '..', 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, '..', 'database', 'seeds', 'production'),
    },
  },
  email: {
    postmark_key: process.env.POSTMARK_KEY_PRODUCTION,
  },
};
