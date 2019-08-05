/*
 * Configuration object schema
 *
 * Specifies the required shape and content of the configuration object.
 */
import * as Joi from '@hapi/joi';
import { Environment } from './types';
import { AppEnum } from '../src/types/internal';


export default Joi.object({
  root: Joi.string().min(1).required(),
  env: Joi.string().only(Object.values(Environment)),
  web: Joi.object({
    host: Joi.string().min(1),
    port: Joi.number().min(0).max(65535).required(),
    router: Joi.object({
      stripTrailingSlash: Joi.boolean().required(),
    }).required(),
    routes: Joi.object({
      cors: Joi.object({
        origin: Joi.array().items(Joi.string()),
        credentials: Joi.boolean(),
        additionalExposedHeaders: Joi.array().items(Joi.string()),
      }).required(),
      security: Joi.alt(
        Joi.only(false),
        Joi.object({
          hsts: Joi.object({
            maxAge: Joi.number().integer().min(365 * 24 * 60 * 60).required(),
            includeSubDomains: Joi.boolean().default(true),
            preload: Joi.boolean().default(true),
          }),
        })
      ).required(),
    }).required(),
  }).required(),
  platform: Joi.object({
    domains: Joi.object({
      [AppEnum.ADMIN]: Joi.string().min(5).required(),
      [AppEnum.DASHBOARD]: Joi.string().min(5).required(),
      [AppEnum.TWINE_API]: Joi.string().min(5).required(),
      [AppEnum.VISITOR]: Joi.string().min(5).required(),
      [AppEnum.VOLUNTEER]: Joi.only(null).required(),
    }),
  }),
  knex: Joi.object({
    client: Joi.string().required(),
    connection: Joi.alternatives().try(
      Joi.object({
        host: Joi.string().min(1).required(),
        port: Joi.number().min(0).max(2 ** 16 - 1).required(),
        database: Joi.string().min(1).replace(/^\//, '').required(),
        user: Joi.string().min(1).required(),
        password: Joi.string().optional(),
        ssl: Joi.bool().default(false),
      }).required(),
      Joi.string().min('psql://localhost:5432'.length)
    ),
    pool: Joi.object({
      min: Joi.number().integer(),
      max: Joi.number().integer().greater(Joi.ref('min')),
      connectionTimeoutMillis: Joi.number().integer().positive(),
    }),
    migrations: Joi.object({
      tableName: Joi.string().min(1).required(),
      directory: Joi.string().min(1).required(),
    }).required(),
    seeds: Joi.object({
      directory: Joi.string().min(1).required(),
    }).required(),
  }).required(),
  cache: Joi.object({
    session: {
      name: Joi.string().min(1).required(),
      options: {
        url: Joi.string().min('redis://localhost:6379'.length),
        tls: Joi.object(),
      },
    },
  }).required(),
  email: Joi.object({
    postmarkKey: Joi.string().required(),
    fromAddress: Joi.string().email().required(),
    developers: Joi.array().items(Joi.string()).length(2),
  }).required(),
  auth: Joi.object({
    schema: {
      session_cookie: Joi.object({
        options: Joi.object({
          name: Joi.string().required(),
          maxCookieSize: Joi.number().integer(),
          cache: Joi.object({
            cache: Joi.string().min(1),
            expiresIn: Joi.number().integer().positive(),
          }),
          cookieOptions: Joi.object({
            password: Joi.string().min(32).required(),
            ttl: Joi.number().integer().positive(),
            isSecure: Joi.boolean(),
            isHttpOnly: Joi.boolean(),
            isSameSite: Joi.only([false, 'Lax', 'Strict']),
            path: Joi.string(),
          }),
        }),
      }),
    },
  }).required(),
  qrcode: Joi.object({
    secret: Joi.string().min(32).required(),
  }).required(),
  webhooks: Joi.object({
    heroku: Joi.object({
      secret: Joi.string().min(32).required(),
    }).required(),
  }).required(),
});
