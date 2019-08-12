/*
 * Twine Webhooks v1
 *
 * To handle auxilary action to subscribed webhooks
 *
 */
import * as Hapi from '@hapi/hapi';
import heroku from './heroku';


export default {
  name: 'Twine Webhooks v1',
  register: async (server: Hapi.Server) => {

    /*
     * Routes
     */

    // Pre-process routes
    const routes = [
      ...heroku,
    ];

    // Register routes
    server.route(routes);
  },
};
