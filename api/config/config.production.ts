import { Environment, Config } from './types';
import { DeepPartial } from '../src/types/internal';
import { envListOr } from './util';

const config: DeepPartial<Config> = {
  env: Environment.PRODUCTION,
  web: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 4002,
    routes: {
      cors: {
        origin: envListOr('CORS_ORIGIN', [
          'https://admin.twine-together.com',
          'https://visitor.twine-together.com',
          'https://data.twine-toghether.com',
        ]),
      },
    },
  },
  knex: {
    connection: process.env.DATABASE_URL,
    pool: {
      max: 20, // Limit imposed by Heroku on current pricing tier
      connectionTimeoutMillis: 1000,
    },
  },
  email: {
    postmarkKey: process.env.POSTMARK_KEY_PRODUCTION,
  },
};

export default config;
