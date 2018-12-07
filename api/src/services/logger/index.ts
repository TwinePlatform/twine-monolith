import * as Hapi from 'hapi';
import { Environment } from '../../../config/types';
import serializers from './serializers';
const hapiPino = require('hapi-pino');


const options = {
  logPayload: true,
  mergeHapiLogData: true,
  serializers,
};

const getOption = (env: Environment) =>
  /* istanbul ignore next */
  env === Environment.TESTING
    ? {}
    : { ...options, prettyPrint: env !== Environment.PRODUCTION };

export default {
  name: 'twine-logger',
  register: async (server: Hapi.Server, options: {env: Environment}) =>
    server.register({
      plugin: hapiPino,
      options: getOption(options.env),
    }),
};
