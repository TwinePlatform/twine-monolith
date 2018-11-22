import { Environment } from './types';

export default {
  env: Environment.STAGING,
  web: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 4002,
    routes: {
      cors: {
        origin: ['https://twine-visitor-staging.herokuapp.com', 'https://admin.twine-together.com'],
        credentials: true,
        additionalExposedHeaders: ['set-cookie'],
      },
    },
  },
  knex: {
    connection: process.env.DATABASE_URL,
  },
  email: {
    postmark_key: process.env.POSTMARK_KEY_PRODUCTION,
  },
};
