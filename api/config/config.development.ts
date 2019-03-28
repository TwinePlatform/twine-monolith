import { Environment, Config } from './types';
import { DeepPartial } from '../src/types/internal';


const config: DeepPartial<Config> = {
  env: Environment.DEVELOPMENT,
  web: {
    port: 4000,
    routes: {
      cors: { // Local dev servers for Visitor App, Volunteer App, Temp Admin Dashboard
        origin: ['http://localhost:3000', 'http://localhost:8100', 'http://localhost:5000'],
      },
    },
  },
  knex: {
    connection: process.env.DATABASE_URL_DEVELOPMENT,
  },
  email: {
    postmarkKey: process.env.POSTMARK_KEY_DEVELOPMENT,
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

export default config;
