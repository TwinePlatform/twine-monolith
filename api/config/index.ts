/*
 * Configuration entry point
 *
 * Exports functions used to generate a single normalised configuration object
 */
require('dotenv').config({ path: './config/.env' });
import * as Joi from 'joi';
import { mergeDeepLeft, compose, converge, identity } from 'ramda';
import configSchema from './config.schema';
import configDefaults from './config.defaults';
import configDevelopment from './config.development';
import configTesting from './config.testing';
import configProduction from './config.production';
import { Config, Environment } from './types';
import { DeepPartial } from '../src/types/internal';

/**
 * Describes the transformations of the default configuration object
 * in the various supported deployment environments
 */
const Configs: { [k in Environment]: DeepPartial<Config> } = {
  [Environment.DEVELOPMENT]: configDevelopment,
  [Environment.TESTING]: configTesting,
  [Environment.PRODUCTION]: configProduction,
};

// Given the deployment environment, applies the appropriate
// transformations to the default config.
//
// Allows an optional filepath for a config override JSON file.
const readConfig = (env = Environment.DEVELOPMENT): Partial<Config> =>
  mergeDeepLeft(Configs[env], configDefaults) as Partial<Config>;

// Validates the given configuration object against the default schema
const validateConfig = (cfg: Partial<Config>): Config => {
  const { error, value } = Joi.validate(cfg, configSchema);

  if (error) {
    throw error;
  }

  return value as Config;
};

const validateEnvironment = (env: string): Environment => {
  switch (env) {
    case Environment.DEVELOPMENT:
      return Environment.DEVELOPMENT;

    case Environment.TESTING:
      return Environment.TESTING;

    case Environment.PRODUCTION:
      return Environment.PRODUCTION;

    default:
      return Environment.DEVELOPMENT;
  }
};

// Utility shortcut for reading and validating configuration
const getConfig: (env: string, path?: string) => Config =
  converge(
    compose(validateConfig, readConfig),
    [validateEnvironment, identity]
  );

export {
  readConfig,
  validateConfig,
  getConfig,
  Environment,
  Config,
};
