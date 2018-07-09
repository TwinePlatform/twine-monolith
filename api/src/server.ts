/*
 * Server initialisation and configuration
 */
import * as Hapi from 'hapi';
import * as Pino from 'hapi-pino';
import * as Knex from 'knex';
import v1 from './api/v1';
import setup from './setup';

/*
 * Extend declaration from hapi
 */
declare module 'hapi' {
  interface ApplicationState {
    config: any;
    knex: Knex;
  }
}

const init = async (config: any): Promise<Hapi.Server> => {

  const server = new Hapi.Server(config.web);

  setup(server);

  await server.register([
    {
      plugin: Pino,
      options: { prettyPrint: true },
    },
    v1,
  ]);

  return server;
};

const start = async (server: Hapi.Server) => {
  await server.start();
  return server;
};

export { init, start };
