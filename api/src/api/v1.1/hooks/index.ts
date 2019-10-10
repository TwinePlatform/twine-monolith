import * as Hapi from '@hapi/hapi';
import onPostHandler from './on_post_handler';
import onPreResponse from './on_pre_response';
import onPreHandler from './on_pre_handler';


export default (server: Hapi.Server): void => {
  server.ext('onPostHandler', onPostHandler, { sandbox: 'plugin' });
  server.ext('onPreResponse', onPreResponse, { sandbox: 'plugin' });
  server.ext('onPreHandler', onPreHandler, { sandbox: 'plugin' });
};
