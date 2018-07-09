/*
 * Pre-requisites, global objects and other setup
 */
import * as Hapi from 'hapi';
import * as Knex from 'knex';

export default (server: Hapi.Server) => {
  const config = server.app.config;

  server.app.knex = Knex(config.knex);

  server.decorate('request', 'knex', server.app.knex);
};
