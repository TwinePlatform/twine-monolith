import * as Hapi from 'hapi';
import { Environment } from '../../../config/types';
import serializers from './serializers';
const hapiPino = require('hapi-pino');


const loggerConfig = {
  logPayload: true,
  mergeHapiLogData: true,
  serializers,
};

export default {
  name: 'twine-logger',
  register: async (server: Hapi.Server, options: {env: Environment}) =>
    options.env === Environment.TESTING
      ? Promise.resolve()
      : server.register({
        plugin: hapiPino,
        options: { ...loggerConfig, prettyPrint: options.env !== Environment.PRODUCTION },
      }),
};
