import * as Hapi from 'hapi';
import { Environment } from '../config/types';
const good = require('good');


const options = {
  includes: {
    request: ['headers', 'payload'],
    response: ['headers', 'payload'],
    reporters: {
      console: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*' }],
        },
        {
          module: 'good-console',
        },
        'stdout',
      ],
    },
  },
};


const getOption = (env: Environment) =>
  /* istanbul ignore next */
  env === Environment.TESTING
    ? {}
    : options;


export default {
  name: 'twine-logger',
  register: async (server: Hapi.Server, options: {env: Environment}) =>
    server.register({
      plugin: good,
      options: getOption(options.env),
    }),
};
