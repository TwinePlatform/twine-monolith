/*
 * Run all server setup steps but do not listen
 * Used as build script for checking server will actually run
 */
import { init } from '../src/server';
import { getConfig, Environment } from '../config';

(async () => {
  console.log('Setting up server');

  const server = await init(getConfig(Environment.TESTING));

  console.log('Server initialising');

  await server.initialize();

  console.log('Initialised, shutting down');

  await server.shutdown();

  console.log('Done');

})();
