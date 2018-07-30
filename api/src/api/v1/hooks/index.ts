import * as Hapi from 'hapi';
import onPostHandler from './onPostHandler';
import onPreResponse from './onPreResponse';


export default (server: Hapi.Server): void => {
  server.ext('onPostHandler', onPostHandler, { sandbox: 'plugin' });
  server.ext('onPreResponse', onPreResponse, { sandbox: 'plugin' });
};
