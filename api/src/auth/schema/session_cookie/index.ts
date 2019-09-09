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

    /*
     * Setup our own onPreAuth hook BEFORE @hapi/yar's own onPreAuth hook
     * This call MUST happen before @hapi/yar is registered
     *
     * See api/docs/sessions#schema for more detail
     */
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
            // Must pass `null` as the error and schema name to Boom constructor
            // in order to allow other auth schema to attempt authentication
            // See https://hapi.dev/api/?v=18.3.2#server.auth.scheme()
            return h.unauthenticated(Boom.unauthorized(null, 'session_cookie'));
          }

          try {
            const res = await opts.validate(request);
            return h.authenticated(res);

          } catch (error) {
            /* istanbul ignore next */
            return h.unauthenticated(error);

          }
        },
      };
    });
  },
};
