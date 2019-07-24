/*
 * Test utility to create a lightweight server object
 *
 * Mostly useful if you need a server but dont want to instantiate the
 * actual server
 */
import * as Knex from 'knex';
import * as Hapi from '@hapi/hapi';
import * as Shot from '@hapi/shot';
import { Config } from '../../config';


type Options = {
  routes?: Hapi.ServerRoute[]
  plugins?: Hapi.Plugin<any>[]
  knex?: Knex,
  hooks?: ((s: Hapi.Server) => void)[]
};

export const init = async (config: Config, options: Options = {}): Promise<Hapi.Server> => {
  const server = new Hapi.Server(config.web);

  if (options.knex) {
    server.app.knex = options.knex;
    server.decorate('request', 'knex', options.knex);
  }

  if (options.plugins) {
    await server.register(options.plugins);
  }

  if (options.hooks) {
    options.hooks.forEach((hook) => hook(server));
  }

  if (options.routes) {
    server.route(options.routes);
  }

  return server;
};


export const getCookie = (res: Shot.ResponseObject) => {
  const setCookie = res.headers['set-cookie'];
  return setCookie[0].split('; ')[0].split('=')[1];
};
