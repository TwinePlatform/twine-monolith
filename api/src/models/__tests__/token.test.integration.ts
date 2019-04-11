import * as Knex from 'knex';
import * as moment from 'moment';
import { getConfig } from '../../../config';
import { getTrx } from '../../../tests/utils/database';
import { Users } from '..';
import { Tokens } from '../token';


describe('Token Model', () => {
  let trx: Knex.Transaction;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  afterAll(async () => {
    await knex.destroy();
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
  });

  afterEach(async () => {
    await trx.rollback();
  });

  describe('createConfirmAddRoleToken', () => {
    test(':: returns a token object when user is supplied', async () => {
      const user = await Users.getOne(knex, { where: { email: '1@aperturescience.com' } });
      const resetToken = await Tokens.createConfirmAddRoleToken(knex, user);

      const expiresAtIsInTheFuture = moment().diff(resetToken.expiresAt) < 0;
      expect(resetToken).toEqual(expect.objectContaining({
        userId: 2,
      }));
      expect(expiresAtIsInTheFuture).toBeTruthy();
      expect(resetToken.token).toBeTruthy();
    });

    test(':: invalidates old reset token when creating a new one', async () => {
      const user = await Users.getOne(knex, { where: { id: 2 } });

      await Tokens.createConfirmAddRoleToken(knex, user);
      await Tokens.createConfirmAddRoleToken(knex, user);
      await Tokens.createConfirmAddRoleToken(knex, user);
      await Tokens.createConfirmAddRoleToken(knex, user);
      await Tokens.createConfirmAddRoleToken(knex, user);

      const rows = await knex('single_use_token')
        .select('*')
        .innerJoin(
          'confirm_add_role',
          'confirm_add_role.single_use_token_id',
          'single_use_token.single_use_token_id')
        .innerJoin(
          'user_account',
          'user_account.user_account_id',
          'confirm_add_role.user_account_id')
        .where({
          'user_account.user_account_id': 2,
          'single_use_token.used_at': null,
          'single_use_token.deleted_at': null,
        })
        .andWhereRaw('single_use_token.expires_at > ?', [new Date()]);

      expect(rows).toHaveLength(1);
    });


    test(':: throws an error when an incorrect email is supplied', async () => {
      expect.assertions(1);
      try {
        const user = await Users.create({ name: 'Rat Man', email: '1999@aperturescience.com' });
        await Tokens.createConfirmAddRoleToken(knex, user);
      } catch (err) {
        expect(err).toBeTruthy();
      }
    });
  });

  describe('useConfirmAddRoleToken', () => {
    test('::SUCCESS - marks valid token as expired', async () => {
      const getTokenForUser = knex('single_use_token')
      .select('*')
      .innerJoin(
        'confirm_add_role',
        'confirm_add_role.single_use_token_id',
        'single_use_token.single_use_token_id')
      .innerJoin(
        'user_account',
        'user_account.user_account_id',
        'confirm_add_role.user_account_id')
      .where({
        'user_account.user_account_id': 1,
        'single_use_token.used_at': null,
        'single_use_token.deleted_at': null,
      })
      .andWhereRaw('single_use_token.expires_at > ?', [new Date()]);

      const user = await Users.getOne(knex, { where: { id: 1 } });
      const { token } = await Tokens.createConfirmAddRoleToken(knex, user);

      const preUseRows = await getTokenForUser;
      expect(preUseRows).toHaveLength(1);

      await Tokens.useConfirmAddRoleToken(knex, user.email, token);

      const postUseRows = await getTokenForUser;
      expect(postUseRows).toHaveLength(0);
    });

    test('::FAIL - returns error for invalid email', async () => {
      expect.assertions(1);
      try {
        await Tokens.useConfirmAddRoleToken(knex,
            '1999@aperturescience.com', 'thisisnotarealtoken');
      } catch (error) {
        expect(error.message).toBe('E-mail not recognised');
      }
    });

    test('::FAIL - returns error no token stored for user', async () => {
      expect.assertions(1);
      try {
        await Tokens.useConfirmAddRoleToken(knex, '1@aperturescience.com', 'thisisnotarealtoken');
      } catch (error) {
        expect(error.message).toBe('Token not recognised');
      }
    });

    test('::FAIL - returns error for invalid token', async () => {
      expect.assertions(1);
      try {
        const user = await Users.getOne(knex, { where: { id: 1 } });
        await Tokens.createConfirmAddRoleToken(knex, user);

        await Tokens.useConfirmAddRoleToken(knex, user.email, 'thisisnotarealtoken');
      } catch (error) {
        expect(error.message).toBe('Token not recognised');
      }
    });
  });

  describe('createPasswordResetToken', () => {
    test(':: returns a token object when user is supplied', async () => {
      const user = await Users.getOne(knex, { where: { email: '1@aperturescience.com' } });
      const resetToken = await Tokens.createPasswordResetToken(knex, user);

      const expiresAtIsInTheFuture = moment().diff(resetToken.expiresAt) < 0;
      expect(resetToken).toEqual(expect.objectContaining({
        userId: 2,
      }));
      expect(expiresAtIsInTheFuture).toBeTruthy();
      expect(resetToken.token).toBeTruthy();
    });

    test(':: invalidates old reset token when creating a new one', async () => {
      const user = await Users.getOne(knex, { where: { id: 2 } });

      await Tokens.createPasswordResetToken(knex, user);
      await Tokens.createPasswordResetToken(knex, user);
      await Tokens.createPasswordResetToken(knex, user);
      await Tokens.createPasswordResetToken(knex, user);
      await Tokens.createPasswordResetToken(knex, user);

      const rows = await knex('single_use_token')
        .select('*')
        .innerJoin(
          'user_secret_reset',
          'user_secret_reset.single_use_token_id',
          'single_use_token.single_use_token_id')
        .innerJoin(
          'user_account',
          'user_account.user_account_id',
          'user_secret_reset.user_account_id')
        .where({
          'user_account.user_account_id': 2,
          'single_use_token.used_at': null,
          'single_use_token.deleted_at': null,
        })
        .andWhereRaw('single_use_token.expires_at > ?', [new Date()]);

      expect(rows).toHaveLength(1);
    });


    test(':: throws an error when an incorrect email is supplied', async () => {
      expect.assertions(1);
      try {
        const user = await Users.create({ name: 'Rat Man', email: '1999@aperturescience.com' });
        await Tokens.createPasswordResetToken(knex, user);
      } catch (err) {
        expect(err).toBeTruthy();
      }
    });
  });

  describe('usePasswordResetToken', () => {
    test('::SUCCESS - marks valid token as expired', async () => {
      const getTokenForUser = knex('single_use_token')
      .select('*')
      .innerJoin(
        'user_secret_reset',
        'user_secret_reset.single_use_token_id',
        'single_use_token.single_use_token_id')
      .innerJoin(
        'user_account',
        'user_account.user_account_id',
        'user_secret_reset.user_account_id')
      .where({
        'user_account.user_account_id': 1,
        'single_use_token.used_at': null,
        'single_use_token.deleted_at': null,
      })
      .andWhereRaw('single_use_token.expires_at > ?', [new Date()]);

      const user = await Users.getOne(knex, { where: { id: 1 } });
      const { token } = await Tokens.createPasswordResetToken(knex, user);

      const preUseRows = await getTokenForUser;
      expect(preUseRows).toHaveLength(1);

      await Tokens.usePasswordResetToken(knex, user.email, token);

      const postUseRows = await getTokenForUser;
      expect(postUseRows).toHaveLength(0);
    });

    test('::FAIL - returns error for invalid email', async () => {
      expect.assertions(1);
      try {
        await Tokens.usePasswordResetToken(knex,
            '1999@aperturescience.com', 'thisisnotarealtoken');
      } catch (error) {
        expect(error.message).toBe('E-mail not recognised');
      }
    });

    test('::FAIL - returns error no token stored for user', async () => {
      expect.assertions(1);
      try {
        await Tokens.usePasswordResetToken(knex, '1@aperturescience.com', 'thisisnotarealtoken');
      } catch (error) {
        expect(error.message).toBe('Token not recognised');
      }
    });

    test('::FAIL - returns error for invalid token', async () => {
      expect.assertions(1);
      try {
        const user = await Users.getOne(knex, { where: { id: 1 } });
        await Tokens.createPasswordResetToken(knex, user);

        await Tokens.usePasswordResetToken(knex, user.email, 'thisisnotarealtoken');
      } catch (error) {
        expect(error.message).toBe('Token not recognised');
      }
    });
  });
});
