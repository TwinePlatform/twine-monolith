import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import * as Yar from '@hapi/yar';
import * as Cookie from 'cookie';


export type ValidateFunction = (sid: string, req: Hapi.Request) => Promise<Hapi.AuthenticationData>;

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
          const sid = extractSid(request, opts);

          if (!sid) {
            return h.unauthenticated(Boom.unauthorized('No session id present'));
          }

          try {
            const res = await opts.validate(sid, request);
            return h.authenticated(res);

          } catch (error) {
            return h.unauthenticated(error);

          }
        },
      };
    });
  },
};

const extractSid = (request: Hapi.Request, opts: Options) => {
  if (opts.cookieKey) {
    return Cookie.parse(request.headers.cookie)[opts.cookieKey];
  }

  if (opts.headerKey) {
    const raw = request.headers[opts.headerKey];
    const result = raw.match(/\w+[ :](\w+)/i);

    if (result) {
      return result[1];
    }
  }

  return null;
};
