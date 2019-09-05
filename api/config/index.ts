/*
 * Configuration entry point
 *
 * Exports functions used to generate a single normalised configuration object
 */
require('dotenv').config({ path: './config/.env' });
import * as Joi from '@hapi/joi';
import { mergeDeepLeft, compose, converge, identity } from 'ramda';
import configSchema from './config.schema';
import configDefaults from './config.defaults';
import configDevelopment from './config.development';
import configTesting from './config.testing';
import configProduction from './config.production';
import { Config, Environment } from './types';
import { DeepPartial } from '../src/types/internal';


declare module 'knex' {
  interface PoolConfig {
    connectionTimeoutMillis?: number;
  }
}


/**
 * Describes the transformations of the default configuration object
 * in the various supported deployment environments
 */
const Configs: { [k in Environment]: DeepPartial<Config> } = {
  [Environment.DEVELOPMENT]: configDevelopment,
  [Environment.TEST]: configTesting,
  [Environment.PRODUCTION]: configProduction,
};

// Given the deployment environment, applies the appropriate
// transformations to the default config.
//
// Allows an optional filepath for a config override JSON file.
const readConfig = (env = Environment.DEVELOPMENT): DeepPartial<Config> =>
  mergeDeepLeft(Configs[env], configDefaults);

// Validates the given configuration object against the default schema
const validateConfig = (cfg: DeepPartial<Config>): Config => {
  const { error, value } = Joi.validate(cfg, configSchema);

  if (error) {
    throw error;
  }

  return value as Config;
};

const getEnvironment = (env: string): Environment => {
  switch (env) {
    case Environment.DEVELOPMENT:
      return Environment.DEVELOPMENT;

    case Environment.TEST:
      return Environment.TEST;

    case Environment.PRODUCTION:
      return Environment.PRODUCTION;

    default:
      throw new Error(`Invalid environment: ${env}`);
  }
};

// Utility shortcut for reading and validating configuration
const getConfig: (env: string, path?: string) => Config =
  converge(
    compose(validateConfig, readConfig),
    [getEnvironment, identity]
  );

export {
  readConfig,
  validateConfig,
  getConfig,
  getEnvironment,
  Environment,
  Config,
};
