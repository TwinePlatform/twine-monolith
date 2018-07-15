import * as Hapi from 'hapi';
import organisations from './organisations';

export default {
  name: 'Twine API v1',
  version: '1.0.0',
  dependencies: 'twine-auth',
  register: async (server: Hapi.Server) => {
    server.route(organisations);
    return;
  },
};
