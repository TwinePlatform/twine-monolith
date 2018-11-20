import { Environment } from './types';

export default {
  env: Environment.TESTING,
  web: {
    port: 4001,
    routes: {
      cors: {
        origin: ['http://localhost:3000'],
      },
    },
  },
  knex: {
    connection: process.env.DATABASE_URL_TESTING,
  },
  email: {
    postmark_key: process.env.POSTMARK_KEY_TESTING,
  },
  auth: {
    standard: {
      cookie: {
        options: {
          isSecure: false,
        },
      },
    },
  },
};
