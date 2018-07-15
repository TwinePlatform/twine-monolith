import * as path from 'path';
import { Environment } from './types';

export default {
  env: Environment.PRODUCTION,
  web: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 4002,
  },
  knex: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 3,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(process.cwd(), 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(process.cwd(), 'database', 'seeds', 'production'),
    },
  },
  email: {
    postmark_key: process.env.POSTMARK_KEY_PRODUCTION,
  },
  secret: {
    jwt_secret: process.env.JWT_SECRET_PRODUCTION,
  },
};
