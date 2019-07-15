/*
 * Configuration defaults
 *
 * Can also hold non-secret, environment-invariant configuration
 * Merged into environment-specific configurations
 */
import * as path from 'path';
import { Environment, Config } from './types';
import { DeepPartial, AppEnum } from '../src/types/internal';
import { envOr } from './util';

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
    standard: {
      jwt: {
        secret: process.env.JWT_SECRET,
        signOptions: {
          algorithm: 'HS256',
          expiresIn: '7 days',
        },
        verifyOptions: {
          algorithms: ['HS256'],
          maxAge: '6 days',
        },
      },
      cookie: {
        name: 'tw-api-session',
        options: {
          ttl: 1000 * 60 * 60 * 24 * 7, // A week
          isSecure: true,
          isHttpOnly: true,
          isSameSite: 'Lax',
          path: '/',
        },
      },
      session_cookie: {
        options: {
          name: 'twine-api-session',
          cookieOptions: {
            password: 'pefwj48208tfh29pd9cm10cprmhx94pfry28ctnc2mkrx0dufpog3',
            isHttpOnly: true,
          },
        },
      },
    },
  },
  qrcode: {
    secret: process.env.QRCODE_HMAC_SECRET,
  },
  email: {
    fromAddress: envOr('EMAIL_FROM_ADDRESS', 'visitorapp@powertochange.org.uk'),
  },
};

export default config;
