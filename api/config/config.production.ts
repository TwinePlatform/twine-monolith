import { Environment } from './types';

export default {
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
    postmark_key: process.env.POSTMARK_KEY_PRODUCTION,
  },
};
