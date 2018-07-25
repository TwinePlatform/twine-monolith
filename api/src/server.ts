/*
 * Server initialisation and configuration
 */
import * as Hapi from 'hapi';
import * as Knex from 'knex';
import v1 from './api/v1';
import setup from './setup';
import routes from './routes';
import { Config } from '../config/types';
import logger from './logger';

// Extend declaration from hapi
declare module 'hapi' {
  interface ApplicationState {
    config: Config;
    knex: Knex;
  }
}

const init = async (config: Config): Promise<Hapi.Server> => {

  const server = new Hapi.Server(config.web);

  setup(server, config);

  await server.register([
    {
      plugin: logger,
      options: { env: config.env },
    },
    {
      plugin: v1,
      options: { jwtSecret: config.secret.jwt_secret },
      routes: { prefix: '/api/v1' },
    },
  ]);

  server.route(routes);

  return server;
};

/* istanbul ignore next */
const start = async (server: Hapi.Server) => {
  await server.start();
  return server;
};

export { init, start };
