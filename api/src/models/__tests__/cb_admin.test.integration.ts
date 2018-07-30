import * as Knex from 'knex';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import factory from '../../../tests/factory';
import { CbAdmin } from '..';
import { getTrx } from '../../../tests/database';


describe('CbAdmin model', () => {
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
    test('get :: returns only those users with a cb-admin role', async () => {
      const admins = await CbAdmin.get(knex);
      expect(admins).toHaveLength(2);
      expect(admins).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Gordon',
          email: '1998@blackmesaresearch.com',
        }),
      ]));
    });

    test('get :: fetch deleted users', async () => {
      const admins = await CbAdmin.get(knex, { whereNot: { deletedAt: null } });
      expect(admins).toHaveLength(1);
      expect(admins).toEqual([expect.objectContaining({
        name: 'Gordon',
        email: '1998@blackmesaresearch.com',
      })]);
    });

    test('getOne :: returns first user with cb-admin role', async () => {
      const admin = await CbAdmin.getOne(knex);
      expect(admin).toEqual(expect.objectContaining({
        name: 'GlaDos',
        email: '1@aperturescience.com',
      }));
    });
  });

  describe('Write', () => {
    test('add :: create new record using minimal information', async () => {
      const changeset = await factory.build('cbAdmin');

      const admin = await CbAdmin.add(trx, changeset);

      expect(admin).toEqual(expect.objectContaining(changeset));
    });

    test('update :: non-foreign key column', async () => {
      const changeset = { email: 'newmail@foo.com' };
      const admin = await CbAdmin.getOne(trx, { where: { id: 2 } });

      const updatedAdmin = await CbAdmin.update(trx, admin, changeset);

      expect(updatedAdmin).toEqual(expect.objectContaining(changeset));
    });

    test('update :: foreign key column', async () => {
      const changeset = { disability: 'no' };
      const admin = await CbAdmin.getOne(trx, { where: { id: 2 } });

      const updatedAdmin = await CbAdmin.update(trx, admin, changeset);

      expect(updatedAdmin).toEqual(expect.objectContaining(changeset));
    });

    test('update :: failed update on foreign key column', async () => {
      expect.assertions(1);

      const changeset = { gender: 'non-existent' };
      const admin = await CbAdmin.getOne(trx, { where: { id: 2 } });

      try {
        await CbAdmin.update(trx, admin, changeset);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('destroy :: marks record as deleted', async () => {
      const admins = await CbAdmin.get(trx, { where: { deletedAt: null } });

      await CbAdmin.destroy(trx, admins[0]);
      const adminsAfterDel = await CbAdmin.get(trx, { where: { deletedAt: null } });
      const deletedAdmins = await CbAdmin.get(trx, { whereNot: { deletedAt: null } });
      const deletedAdmin = await CbAdmin.getOne(trx, { where: { id: admins[0].id } });

      expect(admins.length).toBe(adminsAfterDel.length + 1);
      expect(deletedAdmins).toEqual(expect.arrayContaining([
        expect.objectContaining(
          {
            ...omit(['deletedAt', 'modifiedAt'], admins[0]),
            email: null,
            name: 'none',
            phoneNumber: null,
            postCode: null,
            qrCode: null,
          }
        ),
      ]));
      expect(deletedAdmin.modifiedAt).not.toEqual(admins[0].modifiedAt);
    });
  });

  describe('Serialisation', () => {
    test('serialise :: returns model object without secrets', async () => {
      const admin = await CbAdmin.getOne(knex);

      const serialised = CbAdmin.serialise(admin);

      expect(serialised).toEqual(omit(['password', 'qrCode'], admin));
    });
  });
});
