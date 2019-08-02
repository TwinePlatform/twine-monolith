/*
 * Command line utility for creating an API token
 *
 * Usage:
 *  npm run exec ./bin/api_token.ts -- --cb=CB_NAME --scope=SCOPE
 *
 * Flags:
 *  cb: Name of the CB for which to create the API token
 *  scope: What scope to give the token (corresponds to api_token_access column)
 *
 * Note: Including the argument separator `--` before any of the flags is important.
 *   Without it, the argument parsing will not work.
 */
import * as parse from 'minimist';
import * as Knex from 'knex';
import { getConfig } from '../config';
import { ApiTokens } from '../src/models';


process.on('unhandledRejection', (err) => { throw err; });

const { cb, scope } = parse(process.argv.slice(2));

if (!cb || !scope) {
  throw new Error('Missing arguments');
}

(async () => {
  const { knex: config, env } = getConfig(process.env.NODE_ENV);
  const client = Knex(config);

  try {
    const tkn = await ApiTokens.add(client, ApiTokens.create(cb, scope));

    console.log(`
      API token added to ${env} database:
        ID: ${tkn.id}
        Name: ${tkn.name}
        Access: ${tkn.access}
    `);

  } catch (error) {
    console.log('Something went wrong!');
    console.log(error);
  }

  await client.destroy();
})();
