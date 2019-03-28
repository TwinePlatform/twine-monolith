import { Environment, Config } from './types';
import { DeepPartial } from '../src/types/internal';

const config: DeepPartial<Config> = {
  env: Environment.STAGING,
  web: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 4002,
    routes: {
      cors: {
        origin: ['https://twine-visitor-staging.herokuapp.com'],
        credentials: true,
        additionalExposedHeaders: ['set-cookie'],
      },
    },
  },
  knex: {
    connection: process.env.DATABASE_URL,
  },
  email: {
    postmarkKey: process.env.POSTMARK_KEY_PRODUCTION,
  },
};

export default config;
