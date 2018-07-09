import * as Hapi from 'hapi';
import organisations from './organisations';

export default {
  name: 'Twine API v1',
  register: async (server: Hapi.Server) => {
    server.route(organisations);
    return;
  },
};
