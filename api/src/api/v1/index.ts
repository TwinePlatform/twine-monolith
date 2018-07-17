import * as Hapi from 'hapi';
import organisations from './organisations';
import validateUser from '../../auth/scheme/validate_user';
import * as jwt from 'hapi-auth-jwt2';

export default {
  name: 'Twine API v1',
  register: async (server: Hapi.Server, options: { jwtSecret: string }) => {
    await server.register({
      plugin: jwt,
      once: true }
    );

    server.auth.strategy('standard', 'jwt',
      { key: options.jwtSecret,
        validate: validateUser,
        verifyOptions: { algorithms: ['HS256'] },
      });

    server.auth.default('standard');
    server.route(organisations);
    return;
  },
};
