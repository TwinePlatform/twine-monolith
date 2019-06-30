import * as Hapi from '@hapi/hapi';
import * as Yar from '@hapi/yar';
import * as Cookie from 'cookie';


type Options = {
  cookieKey?: string
  headerKey?: string
  validate: (sid: string, req: Hapi.Request) =>
    Promise<Hapi.AuthenticationData & { isValid: boolean }>
};


export default {
  name: 'session id schema',
  register: async (server: Hapi.Server, options: any) => {

    server.register([
      { plugin: Yar, options: { ...options, once: true } },
    ]);

    server.auth.scheme('session_id', (server, opts: Options) => {
      return {
        async authenticate (request, h) {
          // extract sid
          const sid = extractSid(request, opts);

          if (!sid) {
            return h.unauthenticated(new Error('No session id present in cookie or header'));
          }

          try {
            const res = await opts.validate(sid, request);

            if (res.isValid) {
              return h.authenticated(res);
            }
          } catch (error) {
            return h.unauthenticated(error);

          }
          return h.authenticated({ credentials: {} });
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
