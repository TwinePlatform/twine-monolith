/*
 * Configuration defaults
 *
 * Can also hold non-secret, environment-invariant configuration
 * Merged into environment-specific configurations
 */
import * as path from 'path';
import { Environment, Config } from './types';
import { DeepPartial, AppEnum } from '../src/types/internal';
import { envOr, envListOr } from './util';

const config: DeepPartial<Config> = {
  root: path.resolve(__dirname, '..'),
  env: Environment.DEVELOPMENT,
  web: {
    host: 'localhost',
    port: 1000,
    router: {
      stripTrailingSlash: true,
    },
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
        additionalExposedHeaders: ['set-cookie'],
      },
      security: {
        hsts: {
          maxAge: 365 * 24 * 60 * 60,
          includeSubDomains: true,
          preload: true,
        },
      },
    },
  },
  platform: {
    domains: {
      [AppEnum.ADMIN]: envOr('ADMIN_APP_DOMAIN', 'localhost:3200'),
      [AppEnum.DASHBOARD]: envOr('DASHBOARD_APP_DOMAIN', 'localhost:3100'),
      [AppEnum.TWINE_API]: envOr('TWINE_API_DOMAIN', 'localhost:4000'),
      [AppEnum.VISITOR]: envOr('VISITOR_APP_DOMAIN', 'localhost:3000'),
      [AppEnum.VOLUNTEER]: null,
    },
  },
  knex: {
    client: 'pg',
    connection: {
      host: null,
      port: null,
      database: null,
      user: null,
      ssl: false,
    },
    pool: {
      min: 3,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(process.cwd(), 'database', 'migrations'),
    },
    seeds: {
      directory: path.resolve(process.cwd(), 'database', 'data', 'seed', 'testing'),
    },
  },
  auth: {
    schema: {
      session_cookie: {
        options: {
          name: 'twine-api-session',
          maxCookieSize: 0,
          cookieOptions: {
            password: process.env.COOKIE_PASSWORD,
            isHttpOnly: true,
            path: '/',
          },
          cache: { cache: 'session' }, // Must match one of the caches
        },
      },
    },
  },
  qrcode: {
    secret: process.env.QRCODE_HMAC_SECRET,
  },
  email: {
    fromAddress: envOr('EMAIL_FROM_ADDRESS', 'visitorapp@powertochange.org.uk'),
    developers: envListOr('DEVELOPER_EMAILS', ['one', 'two'], ','),
  },
  webhooks: {
    heroku: {
      secret: envOr('HEROKU_WEBHOOK_SECRET', 'nosecretisethereatthemomentpleaseaddone'),
    },
  },
};

export default config;
