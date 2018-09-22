/*
 * Configuration defaults
 *
 * Can also hold non-secret, environment-invariant configuration
 * Merged into environment-specific configurations
 */
import * as path from 'path';
import { Environment } from './types';

export default {
  root: path.resolve(__dirname, '..'),
  env: Environment.DEVELOPMENT,
  web: {
    host: 'localhost',
    port: 1000,
    tls: null,
    router: {
      stripTrailingSlash: true,
    },
    routes: {
      cors: {
        origin: ['https://visitor.twine-together.com'],
        credentials: true,
        additionalExposedHeaders: ['set-cookie'],
      },
      security: {
        hsts: {
          maxAge: 365 * 24 * 60 * 60,
          includeSubdomains: true,
          preload: true,
        },
      },
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
    },
  },
  qrcode: {
    secret: process.env.QRCODE_HMAC_SECRET,
  },
};
