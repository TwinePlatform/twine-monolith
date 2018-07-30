/*
 * onPreResponse Lifecycle hook
 *
 * This hook runs immediately before the response is sent, but after
 * all response validation
 *
 * Its purpose is to intercept any system runtime errors (either due to
 * uncaught or unhandled bugs or due to default Hapi framework responses)
 * and format them as required by the API.
 *
 * See also: https://hapijs.com/api#request-lifecycle
 */
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Response } from '../schema/response';
import { formatBoom } from '../utils';


export default async (request: Hapi.Request, h: Hapi.ResponseToolkit) =>
  ((<Boom<any>> request.response).isBoom)
    // intercept system errors
    ? formatBoom(<Boom<any>> request.response)
    // pass through
    : h.continue;
