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
import * as Hapi from 'hapi';
import { assocPath, has, nthArg, path } from 'ramda';
import constants from './constants';
import users from './users';
import regions from './regions';
import communityBusinesses from './community_businesses';
import logs from './user_logs';
import addLifecycleHooks from './hooks';
import setupAuthentication from './auth';


/*
 * Adds default failAction value to routes, if not already specified
 */
const addFailActionTo: (f: 'validate' | 'response') => (r: Hapi.ServerRoute) => Hapi.ServerRoute =
  (fragment) => (route) =>
    !has('options', route) ||                             // EITHER No options object
    !has(fragment, path(['options'], route)) ||           // OR No validate/response object
    has('failAction', path(['options', fragment], route)) // OR failAction already defined
      ? route
      : assocPath(['options', fragment, 'failAction'], nthArg(2), route);


export default {
  name: 'Twine API v1',
  register: async (server: Hapi.Server) => {
    /*
     * Authentication Strategies
     */
    await setupAuthentication(server);

    /*
     * Server request lifecycle hooks
     */
    addLifecycleHooks(server);

    /*
     * API Routes
     */

    // Pre-process routes
    const routes = [
      ...constants,
      ...users,
      ...communityBusinesses,
      ...regions,
      ...logs,
    ]
      // Ensures failing request validation returns meaningful message in payload
      .map(addFailActionTo('validate'))
      // Ensures failing response validation returns meaningful message in payload
      .map(addFailActionTo('response'));

    // Register routes
    server.route(routes);
  },
};
