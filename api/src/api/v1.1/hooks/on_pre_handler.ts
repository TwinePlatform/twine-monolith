/*
 * onPreHandler Lifecycle hook
 *
 * This hook runs immediately before the handler is run, but after the request
 * has been validated and authenticated.
 *
 * Its primary purpose currently is to allow a place for request monitoring to
 * be kept without polluting handlers or authentication strategies.
 *
 * See also: https://hapijs.com/api#request-lifecycle
 */
import * as Hapi from '@hapi/hapi';
import * as Standard from '../../../auth/strategies/standard';


export default async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  if (request.auth.isAuthenticated && request.auth.strategy === Standard.name) {
    // only for routes authenticated with the standard strategy
    Standard.Sessions.update(request);
  }

  return h.continue;
};
