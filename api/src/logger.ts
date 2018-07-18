import * as Hapi from 'hapi';
import { Environment } from '../config/types';
const good = require('good');


const getOption = (env: Environment) => {
  /* istanbul ignore next */
  const reporters = env === Environment.TESTING
    ? {}
    : {
      myConsoleReporter: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', response: '*' }],
      }, {
        module: 'good-console',
      }, 'stdout'],
    };
  return {
    ops: {
      interval: 1000,
    },
    reporters,
  };
};

export default {
  name: 'twine-logger',
  register: async (server: Hapi.Server, options: {env: Environment}) => {
    await server.register({
      plugin: good,
      options: getOption(options.env),
    });
    return;
  },
};
