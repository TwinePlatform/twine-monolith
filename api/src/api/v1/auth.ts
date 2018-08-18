/*
 * Authentication Strategies
 */
import * as Hapi from 'hapi';
import * as AuthJwt from 'hapi-auth-jwt2';
import * as standardStrategy from '../../auth/strategies/standard';
import * as externalStrategy from '../../auth/strategies/external';
const AuthBearer = require('hapi-auth-bearer-token');


export default async (server: Hapi.Server, { jwtSecret }: { jwtSecret: string }) => {
  await server.register([
    { plugin: AuthJwt, once: true },
    { plugin: AuthBearer, once: true },
  ]);

  server.auth.strategy('standard', 'jwt', {
    key: jwtSecret,
    validate: standardStrategy.validate,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.strategy('external', 'bearer-access-token', {
    validate: externalStrategy.validate,
  });

  server.auth.default('standard');
};
