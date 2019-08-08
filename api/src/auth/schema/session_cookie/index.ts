import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import * as Yar from '@hapi/yar';


export type ValidateFunction = (req: Hapi.Request) => Promise<Hapi.AuthenticationData>;

type Options = {
  validate: ValidateFunction
};


export default {
  name: 'session id schema',
  register: async (server: Hapi.Server, options: Yar.YarOptions) => {

    server.ext('onPreAuth', (request, h) => {
      if (request.headers.hasOwnProperty('authorization')) {
        const token = request.headers['authorization'];
        const state = { id: token };
        request.state[options.name] = state;
      }
      return h.continue;
    });

    server.register([
      { plugin: Yar, options: { ...options, once: true } },
    ]);

    server.auth.scheme('session_cookie', (server, opts: Options) => {
      return {
        async authenticate (request, h) {
          const isAuthenticated = request.yar.get('isAuthenticated');

          if (!isAuthenticated) {
            return h.unauthenticated(Boom.unauthorized());
          }

          try {
            const res = await opts.validate(request);
            return h.authenticated(res);

          } catch (error) {
            return h.unauthenticated(error);

          }
        },
      };
    });
  },
};
