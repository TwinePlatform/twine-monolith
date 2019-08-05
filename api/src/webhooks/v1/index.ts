/*
 * Twine API v1
 *
 * The API is written as a self-contained plugin. The API tries
 * to minimise its dependencies on other plugins, providing its
 * own authentication strategies, request lifecycle hooks, route
 * definitions, etc.
 *
 * See also
 * - api.json
 */
import * as Hapi from '@hapi/hapi';
import heroku from './heroku';


export default {
  name: 'Twine Webhooks v1',
  register: async (server: Hapi.Server) => {

    /*
     * API Routes
     */

    // Pre-process routes
    const routes = [
      ...heroku,
    ];

    // Register routes
    server.route(routes);
  },
};
