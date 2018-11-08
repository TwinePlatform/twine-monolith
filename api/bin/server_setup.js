#!/usr/bin/env node

/*
 * Run all server setup steps but do not listen
 * Used as build script for checking server will actually run
 */
const { init } = require('../build/src/server');
const { getConfig } = require('../build/config');

(async () => {
  console.log('Setting up server');

  const server = await init(getConfig('development'));

  console.log('Server initialising');

  await server.initialize();

  console.log('Initialised, shutting down');

  await server.shutdown();

  console.log('Done');

})();
