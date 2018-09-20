/*
 * API specific utilities
 */
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { ApiResponse } from './schema/response';

export interface JoiBoomError extends Boom {
  details: {message: string}[];
}

/*
 * formatJoiValidation allows joi errors thrown from
 * failAction to be reformatted before sending response.
 * Note joi throws an error on the first value that fails
 * validation, therefore 'details' will only have 1 element.
 */

export const formatJoiValidation = ({ output: { payload }, details }: JoiBoomError)
  : ApiResponse => {
  const message = details[0].message.split('"');
  return {
    error: {
      statusCode: payload.statusCode,
      type: payload.error,
      message: details[0].message,
      validation: { [message[1]]: message[2].trim() },
    } };
};

/*
 * We only choose to re-format the boom response
 * in order to get rid of the strange artefact of having
 * an `error.error` attribute.
 *
 * This function can be done in one line with `renameKeys`
 * but the compiler complains because it can't infer the
 * correct keys
 */
export const formatBoom = ({ output: { payload } }: Boom<any>): ApiResponse => ({
  error: {
    statusCode: payload.statusCode,
    type: payload.error,
    message: payload.message,
  },
});

/*
 * If the response data is "raw", it is wrapped appropriately.
 * Otherwise if the response has meta-data attached to it (and
 * is therefore correctly formatted) it is simply passed through
 */
export const formatResponse = (res: Hapi.ResponseObject): ApiResponse => {
  const r: any = res.source;

  if (r === null) {
    return { result: null } as ApiResponse;
  }

  if (r.hasOwnProperty('result') && r.hasOwnProperty('meta')) {
    return { ...r } as ApiResponse;
  }

  return {
    result: r,
  };
};
