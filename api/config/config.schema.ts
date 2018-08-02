/*
 * Configuration object schema
 *
 * Specifies the required shape and content of the configuration object.
 */
import * as Joi from 'joi';
import { Environment } from './types';

export default {
  root: Joi.string().min(1).required(),
  env: Joi.string().only(Object.values(Environment)),
  web: Joi.object({
    host: Joi.string().min(1),
    port: Joi.number().min(0).max(65535).required(),
    tls: Joi.alternatives().try(
      Joi.only(null),
      Joi.object({
        key: Joi.string().required(),
        cert: Joi.string().required(),
      })
    ),
    router: Joi.object({
      stripTrailingSlash: Joi.boolean().required(),
    }),
  }),
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
      }),
      Joi.string().min('psql://localhost:5432'.length)
    ),
    pool: Joi.object({
      min: 3,
    }),
    migrations: Joi.object({
      tableName: Joi.string().min(1).required(),
      directory: Joi.string().min(1).required(),
    }),
    seeds: Joi.object({
      directory: Joi.string().min(1).required(),
    }),
  }),
  email: Joi.object({
    postmark_key: Joi.string().required(),
  }),
  secret: Joi.object({
    jwt_secret: Joi.string().required(),
  }).required(),
  qrcode: Joi.object({
    secret: Joi.string().min(32).required(),
  }).required(),
};
