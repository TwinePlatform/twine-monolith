import * as path from 'path';
import { Environment } from './types';

export default {
  env: Environment.TESTING,
  web: {
    port: 4001,
  },
  knex: {
    client: 'pg',
    connection: process.env.DATABASE_URL_TESTING,
    pool: {
      min: 3,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(process.cwd(), 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(process.cwd(), 'database', 'seeds', 'testing'),
    },
  },
  email: {
    postmark_key: process.env.POSTMARK_KEY_TESTING,
  },
  secret: {
    jwt_secret: process.env.JWT_SECRET_TESTING,
  },
};
