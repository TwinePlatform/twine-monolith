import * as moment from 'moment';
import { randomBytes } from 'crypto';
import { hash, compare } from 'bcrypt';
import { SingleUseToken, TokenCollection } from './types';
import { Users } from './user';

export const Tokens: TokenCollection = {
  async create (client, user, table) {
    const twoDaysFromToday = moment().add(2, 'days').toISOString();
    const token = randomBytes(32).toString('hex');
    const hashToken = await hash(token, 12);

    const res = await client.transaction(async (trx) => {

      // invalidate old tokens
      await trx.raw(
        'UPDATE single_use_token '
      + 'SET expires_at = now() '
      + `FROM ${table} `
      + `WHERE single_use_token.single_use_token_id = ${table}.single_use_token_id `
      + `AND ${table}.user_account_id = ?`, [user.id]);

      // create single use token
      const [tokenRow] = await trx('single_use_token')
        .insert({ token: hashToken, expires_at: twoDaysFromToday })
        .returning([
          'single_use_token_id AS id',
          'created_at AS createdAt',
          'expires_at AS expiresAt',
        ]);

      // link token to  table
      const [userId] = await trx(table)
        .insert({
          single_use_token_id: tokenRow.id,
          user_account_id:
          user.id || trx('user_account').select('user_account_id').where({ email: user.email }),
        })
        .returning('user_account_id AS userId');

      return { ...tokenRow, userId };
    });

    return { ...res, token } as SingleUseToken;
  },

  async createPasswordResetToken (client, user) {
    return Tokens.create(client, user, 'user_secret_reset');
  },

  async createConfirmAddRoleToken (client, user) {
    return Tokens.create(client, user, 'confirm_add_role');
  },

  async use (client, email, token, table) {
    // get user
    const user = await Users.getOne(client, { where: { email } });
    if (!user) throw new Error('E-mail not recognised');

    // get valid token matching user
    const [match] = await client('single_use_token')
      .select('*')
      .innerJoin(
        table,
        `${table}.single_use_token_id`,
        'single_use_token.single_use_token_id')
      .innerJoin(
        'user_account',
        'user_account.user_account_id',
        `${table}.user_account_id`)
      .where({
        'user_account.email': email,
        'single_use_token.used_at': null,
        'single_use_token.deleted_at': null,
      })
      .andWhereRaw('single_use_token.expires_at > ?', [moment().toISOString()]);

    if (!match) throw new Error('Token not recognised');

    // check token hash matches supplied token
    const isValid = await compare(token, match.token);

    if (!isValid) throw new Error('Token not recognised');

    // update token row as used
    await client('single_use_token')
      .update({ used_at: moment().toISOString() })
      .where({ single_use_token_id: match.single_use_token_id });

    return null;
  },

  async usePasswordResetToken (client, email, token) {
    return Tokens.use(client, email, token, 'user_secret_reset');
  },

  async useConfirmAddRoleToken (client, email, token) {
    return Tokens.use(client, email, token, 'confirm_add_role');
  },

};
