/*
 * Configuration object schema
 *
 * Specifies the required shape and content of the configuration object.
 */
import * as Joi from 'joi';
import { Environment } from './types';


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
            includeSubdomains: Joi.boolean().default(true),
            preload: Joi.boolean().default(true),
          }),
        })
      ).required(),
    }).required(),
  }).required(),
  knex: Joi.object({
    client: Joi.string().required(),
    connection: Joi.alternatives().try(
      Joi.object({
        host: Joi.string().min(1).required(),
        port: Joi.number().min(0).max(65535).required(),
        database: Joi.string().min(1).replace(/^\//, '').required(),
        user: Joi.string().min(1).required(),
        password: Joi.string().optional(),
        ssl: Joi.bool().default(false),
      }).required(),
      Joi.string().min('psql://localhost:5432'.length)
    ),
    pool: Joi.object({
      min: 3,
    }),
    migrations: Joi.object({
      tableName: Joi.string().min(1).required(),
      directory: Joi.string().min(1).required(),
    }).required(),
    seeds: Joi.object({
      directory: Joi.string().min(1).required(),
    }).required(),
  }).required(),
  email: Joi.object({
    postmark_key: Joi.string().required(),
  }).required(),
  auth: Joi.object({
    standard: {
      jwt: Joi.object({
        secret: Joi.string().required(),
        signOptions: Joi.object({
          algorithm: Joi.string(),
          expiresIn: Joi.alt([Joi.string(), Joi.number().integer().positive()]),
        }),
        verifyOptions: Joi.object({
          algorithms: Joi.array().items(Joi.string()),
          maxAge: Joi.alt([Joi.string(), Joi.number().integer().positive()]),
        }),
      }),
      cookie: Joi.object({
        name: Joi.string().required(),
        options: Joi.object({
          ttl: Joi.number().integer().positive(),
          isSecure: Joi.boolean(),
          isHttpOnly: Joi.boolean(),
          isSameSite: Joi.only([false, 'Lax', 'Strict']),
          path: Joi.string().required(),
          domain: Joi.string(),
        }).required(),
      }).required(),
    },
  }).required(),
  qrcode: Joi.object({
    secret: Joi.string().min(32).required(),
  }).required(),
});
