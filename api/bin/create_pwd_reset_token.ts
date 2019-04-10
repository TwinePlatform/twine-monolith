/*
 * script for creating a new password reset token locally
 */

import * as Knex from 'knex';
import { Users } from '../src/models';
import { getConfig } from '../config';
import { Tokens } from '../src/models/token';

(async () => {
  const { knex: config } = getConfig('development');

  const client = Knex(config);

  const user = await Users.getOne(client, { where: { id: 1 } });
  await Tokens.createPasswordResetToken(client, user);

  return client.destroy();
})();
