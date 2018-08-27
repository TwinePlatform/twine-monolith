/*
 * Authentication Strategies
 */
import * as Hapi from 'hapi';
import * as AuthJwt from 'hapi-auth-jwt2';
import * as standardStrategy from '../../auth/strategies/standard';
import * as externalStrategy from '../../auth/strategies/external';
const AuthBearer = require('hapi-auth-bearer-token');


export default async (server: Hapi.Server) => {
  const { config: { auth: { standard } } } = server.app;

  /*
   * Pre-requisite plugins
   */
  await server.register([
    { plugin: AuthJwt, once: true },
    { plugin: AuthBearer, once: true },
  ]);

  /*
   * Standard strategy
   */
  server.auth.strategy('standard', 'jwt', {
    key: standard.jwt.secret,
    validate: standardStrategy.validate,
    verifyOptions: { algorithms: ['HS256'], ...standard.jwt.verifyOptions },
    cookieKey: standard.cookie.name,
  });

  server.state(standard.cookie.name, standard.cookie.options);

  /*
   * External strategy
   */
  server.auth.strategy('external', 'bearer-access-token', {
    validate: externalStrategy.validate,
  });

  /*
   * Set default
   */
  server.auth.default('standard');
};
