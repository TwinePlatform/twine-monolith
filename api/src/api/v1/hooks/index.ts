import * as Hapi from 'hapi';
import onPostHandler from './on_post_handler';
import onPreResponse from './on_pre_response';


export default (server: Hapi.Server): void => {
  server.ext('onPostHandler', onPostHandler, { sandbox: 'plugin' });
  server.ext('onPreResponse', onPreResponse, { sandbox: 'plugin' });
};
