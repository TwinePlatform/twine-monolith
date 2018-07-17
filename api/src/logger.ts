import * as Hapi from 'hapi';
import { Environment } from '../config/types';

const getOption = (env: string) => {
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
  register: async (server: Hapi.Server, options: {env: string}) => {
    await server.register({
      plugin: require('good'),
      options: getOption(options.env),
    });
    return;
  },
};
