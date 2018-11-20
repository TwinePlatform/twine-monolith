import { Environment } from './types';

export default {
  env: Environment.PRODUCTION,
  web: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 4002,
  },
  knex: {
    connection: process.env.DATABASE_URL,
  },
  email: {
    postmark_key: process.env.POSTMARK_KEY_PRODUCTION,
  },
};
