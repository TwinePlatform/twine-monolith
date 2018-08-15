/*
 * Authentication Strategies
 */
import * as Hapi from 'hapi';
import * as AuthJwt from 'hapi-auth-jwt2';
import validateUser from '../../auth/scheme/validate_user';
import validateExternal from '../../auth/scheme/validate_external';
const AuthBearer = require('hapi-auth-bearer-token');


export default async (server: Hapi.Server, { jwtSecret }: { jwtSecret: string }) => {
  await server.register([
    { plugin: AuthJwt, once: true },
    { plugin: AuthBearer, once: true },
  ]);

  server.auth.strategy('standard', 'jwt', {
    key: jwtSecret,
    validate: validateUser,
    verifyOptions: { algorithms: ['HS256'] },
  });

  server.auth.strategy('external', 'bearer-access-token', {
    validate: validateExternal,
  });

  server.auth.default('standard');
};
