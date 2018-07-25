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
import * as AuthJwt from 'hapi-auth-jwt2';
import organisations from './organisations';
import surveys from './surveys';
import constants from './constants';
import validateUser from '../../auth/scheme/validate_user';
import validateExternal from '../../auth/scheme/validate_external';
import addHookOnPostHandler from './hooks/onPostHandler';
const AuthBearer = require('hapi-auth-bearer-token');

export default {
  name: 'Twine API v1',
  register: async (server: Hapi.Server, options: { jwtSecret: string }) => {
    /*
     * Authentication Strategies
     */
    await server.register([
      { plugin: AuthJwt, once: true },
      { plugin: AuthBearer, once: true },
    ]);

    server.auth.strategy('standard', 'jwt', {
      key: options.jwtSecret,
      validate: validateUser,
      verifyOptions: { algorithms: ['HS256'] },
    });

    server.auth.strategy('external', 'bearer-access-token', {
      validate: validateExternal,
    });

    server.auth.default('standard');


    /*
     * Server request lifecycle hooks
     */
    addHookOnPostHandler(server);

    /*
     * API Routes
     */
    server.route([
      ...constants,
      ...organisations,
      ...surveys,
    ]);
  },
};
