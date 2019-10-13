import * as Hapi from '@hapi/hapi';
import * as Standard from './strategies/standard';
import * as External from './strategies/external';
import * as HerokuWebHooks from './strategies/heroku_webhook';
import SessionCookieSchema from './schema/session_cookie';
const AuthBearer = require('hapi-auth-bearer-token');

import { PermissionLevelEnum } from './types';

const strategies = { Standard, External, HerokuWebHooks };

const plugin = {
  name: 'twine-auth',
  register: async (server: Hapi.Server) => {
    const { config: { auth: { schema } } } = server.app;

    /*
   * Pre-requisite plugins
   */
    await server.register([
      { plugin: SessionCookieSchema, options: { once: true, ...schema.session_cookie.options } },
      { plugin: AuthBearer, once: true },
    ]);

    /*
   * Standard strategy
   */
    server.auth.strategy('standard', 'session_cookie', { validate: Standard.validate });

    /*
   * External strategy
   */
    server.auth.strategy('external', 'bearer-access-token', { validate: External.validate });

    /*
   * Heroku Webhook strategy
   */

    server.auth.strategy('herokuWebhook', 'bearer-access-token', {
      validate: HerokuWebHooks,
    });

    /*
   * Set default
   */
    server.auth.default('standard');
  }
}

export {
  PermissionLevelEnum,
  strategies,
  plugin,
};
