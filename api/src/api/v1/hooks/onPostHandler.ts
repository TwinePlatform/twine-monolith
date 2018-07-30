/*
 * onPostHandler Lifecycle hook
 *
 * This hook runs immediately after the handler returns, and before
 * any validation of the response is performed.
 *
 * Its purpose is to ensure the response is correctly formatted before
 * being passed to the validation stage.
 *
 * It essentially provides a shortcut for handlers; if there is no
 * meta-data required in the response, they can simply return the
 * `data` value, instead of manually wrapping the data in a correctly
 * formatted object.
 *
 * Similarly, if the handler returns a Boom object, the hook will format
 * this object correctly.
 *
 * See also: https://hapijs.com/api#request-lifecycle
 */
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Response } from '../schema/response';
import { formatBoom, formatResponse } from '../utils';


export default async (request: Hapi.Request, h: Hapi.ResponseToolkit) =>
  ((<Boom<any>> request.response).isBoom)
    // error formatting handled in onPreResponse
    ? formatBoom(<Boom<any>> request.response)
    // correctly format response payload
    : formatResponse(<Hapi.ResponseObject> request.response);
