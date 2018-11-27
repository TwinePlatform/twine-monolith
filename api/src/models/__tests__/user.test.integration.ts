import * as Knex from 'knex';
import * as moment from 'moment';
import { compare } from 'bcrypt';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import factory from '../../../tests/utils/factory';
import { getTrx } from '../../../tests/utils/database';
import { Users, GenderEnum } from '..';


describe('User Model', () => {
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

  describe('Read', () => {
    test('get :: no arguments gets all users', async () => {
      const users = await Users.get(trx);

      expect(users.length).toBe(8);
      expect(users).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Chell',
          gender: 'female',
          disability: 'no',
          ethnicity: 'prefer not to say',
          email: '1498@aperturescience.com',
          birthYear: 1988,
          isEmailConfirmed: false,
        }),
      ]));
    });

    test('get :: filter users by ID | non-existent ID resolves to empty array', async () => {
      const users = await Users.get(trx, { where: { id: 500 } });
      expect(users).toEqual([]);
    });

    test('get :: get deleted users', async () => {
      const users = await Users.get(trx, { whereNot: { deletedAt: null } });
      expect(users).toEqual([
        expect.objectContaining({
          id: 3,
          name: 'Gordon',
        }),
      ]);
    });

    test('get :: limit results', async () => {
      const users = await Users.get(trx, { limit: 1 });
      expect(users.length).toBe(1);
    });

    test('get :: order results', async () => {
      const users = await Users.get(trx, { order: ['name', 'desc'] });
      expect(users.map((u) => u.name).sort())
        .toEqual([
          'Barney',
          'Big Boss',
          'Chell',
          'Emma Emmerich',
          'GlaDos',
          'Gordon',
          'Raiden',
          'Turret',
        ]);
    });

    test('get :: offset results', async () => {
      const users = await Users.get(trx, { offset: 3, order: ['id', 'asc'] });
      expect(users.length).toBe(5);
      expect(users[0].name).toBe('Barney');
    });

    test('exists :: returns true for existent user', async () => {
      const exists = await Users.exists(knex, { where: { name: 'Gordon' } });
      expect(exists).toBe(true);
    });

    test('exists :: returns false for non-existent user', async () => {
      const exists = await Users.exists(knex, { where: { name: 'foo' } });
      expect(exists).toBe(false);
    });

  });

  describe('Write', () => {
    test('update :: successful update of non-foreign-key column', async () => {
      const user = await Users.getOne(trx, { where: { id: 1 } });
      const changes = { name: 'GLaDOS' };
      const omitter = omit(['name', 'modifiedAt']);

      const updatedUser = await Users.update(trx, user, changes);

      expect(omitter(updatedUser)).toEqual(omitter(user));
      expect(updatedUser.name).toBe(changes.name);
    });

    test('update :: successful update of foreign-key column', async () => {
      const user = await Users.getOne(trx, { where: { id: 1 } });
      const changes = { gender: GenderEnum.MALE };
      const omitter = omit(['gender', 'modifiedAt']);

      const updatedUser = await Users.update(trx, user, changes);

      expect(omitter(updatedUser)).toEqual(omitter(user));
      expect(updatedUser.gender).toBe('male');
    });

    test('update :: can update password', async () => {
      const user = await Users.getOne(trx, { where: { id: 1 } });
      const changes = { password: 'Foooo!oo2o3r' };
      const omitter = omit(['password', 'modifiedAt']);

      const updatedUser = await Users.update(trx, user, changes);

      expect(omitter(updatedUser)).toEqual(omitter(user));
      expect(await compare(changes.password, updatedUser.password)).toBe(true);
    });

    test('add :: create a new record using minimal information', async () => {
      const changeset = await factory.build('user');

      const user = await Users.add(trx, changeset);
      const passwordCheck = await compare(changeset.password, user.password);

      expect(user).toEqual(expect.objectContaining({
        ...omit(['password'], changeset),
        gender: 'prefer not to say',
        ethnicity: 'prefer not to say',
        disability: 'prefer not to say',
      }));
      expect(passwordCheck).toBeTruthy();
    });

    test('destroy :: mark existing record as deleted', async () => {
      const users = await Users.get(trx, { where: { deletedAt: null } });

      await Users.destroy(trx, users[0]);
      const usersAfterDel = await Users.get(trx, { where: { deletedAt: null } });
      const deletedUsers = await Users.get(trx, { whereNot: { deletedAt: null } });
      const deletedUser = await Users.getOne(trx, { where: { id: users[0].id } });

      expect(users.length).toBe(usersAfterDel.length + 1);
      expect(deletedUsers).toEqual(expect.arrayContaining([
        expect.objectContaining(
          {
            ...omit(['deletedAt', 'modifiedAt'], users[0]),
            email: null,
            name: 'none',
            phoneNumber: null,
            postCode: null,
            qrCode: null,
            isEmailConfirmed: false,
            isPhoneNumberConfirmed: false,
            isEmailConsentGranted: false,
            isSMSConsentGranted: false,
          }
        ),
      ]));
      expect(deletedUser.modifiedAt).not.toEqual(users[0].modifiedAt);
      expect(deletedUser.deletedAt).not.toEqual(null);
    });
  });

  describe('Serialisation', () => {
    test('serialise :: returns model object without secrets', async () => {
      const user = await Users.getOne(knex);

      const serialised = await Users.serialise(user);

      expect(serialised).toEqual(omit(['password', 'qrCode'], user));
    });
  });

  describe('createPasswordResetToken', () => {
    test(':: returns a token object when user is supplied', async () => {
      const user = await Users.getOne(knex, { where: { email: '1@aperturescience.com' } });
      const resetToken = await Users.createPasswordResetToken(knex, user);

      const expiresAtIsInTheFuture = moment().diff(resetToken.expiresAt) < 0;
      expect(resetToken).toEqual(expect.objectContaining({
        userId: 2,
      }));
      expect(expiresAtIsInTheFuture).toBeTruthy();
      expect(resetToken.token).toBeTruthy();
    });

    test(':: invalidates old reset token when creating a new one', async () => {
      const user = await Users.getOne(knex, { where: { id: 2 } });

      await Users.createPasswordResetToken(knex, user);
      await Users.createPasswordResetToken(knex, user);
      await Users.createPasswordResetToken(knex, user);
      await Users.createPasswordResetToken(knex, user);
      await Users.createPasswordResetToken(knex, user);

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
        await Users.createPasswordResetToken(knex, user);
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
      const { token } = await Users.createPasswordResetToken(knex, user);

      const preUseRows = await getTokenForUser;
      expect(preUseRows).toHaveLength(1);

      await Users.usePasswordResetToken(knex, user.email, token);

      const postUseRows = await getTokenForUser;
      expect(postUseRows).toHaveLength(0);
    });

    test('::FAIL - returns error for invalid email', async () => {
      expect.assertions(1);
      try {
        await Users.usePasswordResetToken(knex, '1999@aperturescience.com', 'thisisnotarealtoken');
      } catch (error) {
        expect(error.message).toBe('E-mail not recognised');
      }
    });

    test('::FAIL - returns error no token stored for user', async () => {
      expect.assertions(1);
      try {
        await Users.usePasswordResetToken(knex, '1@aperturescience.com', 'thisisnotarealtoken');
      } catch (error) {
        expect(error.message).toBe('Token not recognised');
      }
    });

    test('::FAIL - returns error for invalid token', async () => {
      expect.assertions(1);
      try {
        const user = await Users.getOne(knex, { where: { id: 1 } });
        await Users.createPasswordResetToken(knex, user);

        await Users.usePasswordResetToken(knex, user.email, 'thisisnotarealtoken');
      } catch (error) {
        expect(error.message).toBe('Token not recognised');
      }
    });
  });
});

