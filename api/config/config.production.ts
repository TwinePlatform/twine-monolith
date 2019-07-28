import * as path from 'path';
import { Environment, Config } from './types';
import { DeepPartial } from '../src/types/internal';
import { envListOr, envNumberOr, parseRedisUrl } from './util';


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
      max: envNumberOr('DATABASE_POOL_LIMIT', 20),
      connectionTimeoutMillis: 1000,
    },
    seeds: {
      directory: path.resolve(process.cwd(), 'database', 'data', 'seed', 'production'),
    },
  },
  email: {
    postmarkKey: process.env.POSTMARK_KEY_PRODUCTION,
  },
  auth: {
    schema: {
      session_cookie: {
        options: {
          cookieOptions: {
            isSecure: true,
          },
          cache: { cache: 'session' }, // Must match one of the caches
        },
      },
    },
  },
  cache: {
    session: { name: 'session', options: parseRedisUrl(process.env.REDIS_URL) },
  },
};

export default config;
