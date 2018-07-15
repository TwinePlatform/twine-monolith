import * as Hapi from 'hapi';
import validateUser from './validate_user';

export default {
  name: 'twine-auth',
  version: '1.0.0',
  register: async (server: Hapi.Server, options: { jwtSecret: string }) => {
    await server.register([
      require('hapi-auth-jwt2'),
    ]);

    server.auth.strategy('standard', 'jwt',
      { key: options.jwtSecret,
        validate: validateUser,
        verifyOptions: { algorithms: ['HS256'] },
      });

    server.auth.default('standard');
    return;
  },
};
