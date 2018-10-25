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
import constants from './constants';
import users from './users';
import regions from './regions';
import communityBusinesses from './community_businesses';
import logs from './user_logs';
import addLifecycleHooks from './hooks';
import setupAuthentication from './auth';


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
    server.route([
      ...constants,
      ...users,
      ...communityBusinesses,
      ...regions,
      ...logs,
    ]);
  },
};
