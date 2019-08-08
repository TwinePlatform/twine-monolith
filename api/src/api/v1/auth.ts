/*
 * Authentication Strategies
 */
import * as Hapi from '@hapi/hapi';
import SessionCookieSchema from '../../auth/schema/session_cookie';
import * as standardStrategy from '../../auth/strategies/standard';
import * as externalStrategy from '../../auth/strategies/external';
const AuthBearer = require('hapi-auth-bearer-token');


export default async (server: Hapi.Server) => {
  const { config: { auth: { schema } } } = server.app;

  /*
   * Pre-requisite plugins
   */
  await server.register([
    { plugin: SessionCookieSchema, options: { once: true, ...schema.session_cookie.options } },
    { plugin: AuthBearer, once: true },
  ]);

  /*
   * Standard strategy
   */
  server.auth.strategy('standard', 'session_cookie', { validate: standardStrategy.validate });

  /*
   * External strategy
   */
  server.auth.strategy('external', 'bearer-access-token', { validate: externalStrategy.validate });

  /*
   * Set default
   */
  server.auth.default('standard');
};
