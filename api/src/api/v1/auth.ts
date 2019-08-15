/*
 * Authentication Strategies
 */
import * as Hapi from '@hapi/hapi';
import SessionCookieSchema from '../../auth/schema/session_cookie';
import * as standardStrategy from '../../auth/strategies/standard';
import * as externalStrategy from '../../auth/strategies/external';
import herokuWebhookStrategy from '../../auth/strategies/heroku_webhook';
const AuthBearer = require('hapi-auth-bearer-token');


export const getCredentialsFromRequest = (request: Hapi.Request) => {
  switch (request.auth.strategy) {
    case standardStrategy.name:
      return standardStrategy.Credentials.fromRequest(request);

    case externalStrategy.name:
      return externalStrategy.ExternalCredentials.fromRequest(request);

    default:
      throw new Error(`Unrecognised strategy: ${request.auth.strategy}`);
  }
};


export default async (server: Hapi.Server) => {
  const { config: { auth: { schema }, cache }, knex } = server.app;

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
  server.auth.strategy('standard', 'session_cookie', { validate: standardStrategy.validate });
  const cleanup = standardStrategy.monitorSessionExpiry(knex, cache.session.options.url);
  server.events.on('stop', cleanup);

  /*
   * External strategy
   */
  server.auth.strategy('external', 'bearer-access-token', { validate: externalStrategy.validate });

  /*
   * Heroku Webhook strategy
   */

  server.auth.strategy('herokuWebhook', 'bearer-access-token', {
    validate: herokuWebhookStrategy,
  });

  /*
   * Set default
   */
  server.auth.default('standard');
};
