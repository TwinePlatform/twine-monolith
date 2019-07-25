import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import * as Yar from '@hapi/yar';
import * as Cookie from 'cookie';


export type ValidateFunction = (req: Hapi.Request) => Promise<Hapi.AuthenticationData>;

type Options = {
  cookieKey?: string
  headerKey?: string
  validate: ValidateFunction
};


export default {
  name: 'session id schema',
  register: async (server: Hapi.Server, options: Yar.YarOptions) => {

    server.register([
      { plugin: Yar, options: { ...options, once: true } },
    ]);

    server.auth.scheme('session_id', (server, opts: Options) => {
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
