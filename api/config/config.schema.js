/*
 * Configuration object schema
 *
 * Specifies the required shape and content of the configuration object.
 */
const Joi = require('joi');
const { DEVELOPMENT, TESTING, PRODUCTION } = require('./environments');

module.exports = {
  root: Joi.string().min(1).required(),
  env: Joi.string().only(DEVELOPMENT, TESTING, PRODUCTION),
  web: Joi.object({
    host: Joi.string().min(1),
    port: Joi.number().min(0).max(65535).required(),
    tls: Joi.alternatives().try(
      Joi.only(null),
      Joi.object({
        key: Joi.string().required(),
        cert: Joi.string().required(),
      }),
    ),
  }),
  knex: Joi.object({
    client: Joi.string().required(),
    connection: Joi.object({
      host: Joi.string().min(1).required(),
      port: Joi.number().min(0).max(65535).required(),
      database: Joi.string().min(1).replace(/^\//, '').required(),
      user: Joi.string().min(1).required(),
      password: Joi.string().optional(),
      ssl: Joi.bool().default(false),
    }),
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
};
