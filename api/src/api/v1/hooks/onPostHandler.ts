import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Dictionary } from 'ramda';
import { response } from '../schema/response';
import { renameKeys } from '../../../utils/';


const formatBoom = (b: Boom<any>) => ({
  error: renameKeys({ error: 'type' }, b.output.payload),
  meta: {},
});

const formatResponse = (r: Hapi.ResponseObject) => {
  if (r.hasOwnProperty('data') && r.hasOwnProperty('meta')) {
    return { ...r };
  }

  return {
    data: r,
    meta: {},
  };
};


export default (server: Hapi.Server) => {
  server.ext('onPostHandler', async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    // intercept errors
    if ((<Boom<any>> request.response).isBoom) {
      return formatBoom(<Boom<any>> request.response);
    }

    // correctly format response payload
    return formatResponse(<Hapi.ResponseObject> request.response);

  }, { sandbox: 'plugin' });
};
