import * as path from 'path';
import { envOr } from './util';
import { Environment, Config } from './types';
import { DeepPartial } from '../src/types/internal';


const config: DeepPartial<Config> = {
  env: Environment.TEST,
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
    seeds: {
      directory: path.resolve(process.cwd(), 'database', 'data', 'seed', 'testing'),
    },
  },
  email: {
    postmarkKey: process.env.POSTMARK_KEY_TESTING,
  },
  auth: {
    schema: {
      session_cookie: {
        options: {
          cookieOptions: {
            isSecure: false,
          },
          cache: {
            cache: 'session', // Must match one of the caches
            expiresIn: 3000,
          },
        },
      },
    },
  },
  cache: {
    session: {
      name: 'session',
      options: { url: envOr('REDIS_URL_TESTING', 'redis://localhost:6379') },
    },
  },
};

export default config;
