import { Environment, Config } from './types';
import { DeepPartial } from '../src/types/internal';

const config: DeepPartial<Config> = {
  env: Environment.PRODUCTION,
  web: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 4002,
    routes: {
      cors: {
        origin: ['https://admin.twine-together.com', 'https://visitor.twine-together.com'],
      },
    },
  },
  knex: {
    connection: process.env.DATABASE_URL,
    pool: {
      max: 20,
      connectionTimeoutMillis: 1000,
    },
  },
  email: {
    postmarkKey: process.env.POSTMARK_KEY_PRODUCTION,
  },
};

export default config;
