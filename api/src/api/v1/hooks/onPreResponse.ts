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
import { formatBoom, formatJoiValidation, JoiBoomError } from '../utils';


export default async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {

  if (!(<Boom<any>> request.response).isBoom) {
    return h.continue;
  } else if (request.response.name === 'ValidationError') {
    const err = <JoiBoomError> request.response;
    return h.response(formatJoiValidation(err)).code(err.output.statusCode);
  } else {
    const err = <Boom<any>> request.response;
    return h.response(formatBoom(err)).code(err.output.statusCode);
  }
};
