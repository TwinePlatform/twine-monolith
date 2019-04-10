import * as Knex from 'knex';
import { compare } from 'bcrypt';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import factory from '../../../tests/utils/factory';
import { getTrx } from '../../../tests/utils/database';
import { CbAdmins, DisabilityEnum } from '..';
import { CommunityBusinesses } from '../community_business';
import { Roles, RoleEnum } from '../../auth';


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
      const admins = await CbAdmins.get(knex);
      expect(admins).toHaveLength(2);
      expect(admins).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Gordon',
          email: '1998@blackmesaresearch.com',
        }),
      ]));
    });

    test('get :: fetch deleted users', async () => {
      const admins = await CbAdmins.get(knex, { whereNot: { deletedAt: null } });
      expect(admins).toHaveLength(1);
      expect(admins).toEqual([expect.objectContaining({
        name: 'Gordon',
        email: '1998@blackmesaresearch.com',
      })]);
    });

    test('getOne :: returns first user with cb-admin role', async () => {
      const admin = await CbAdmins.getOne(knex, { order: ['name', 'asc'] });
      expect(admin).toEqual(expect.objectContaining({
        name: 'GlaDos',
        email: '1@aperturescience.com',
      }));
    });

    test('exists :: returns true for existent cb-admin', async () => {
      const exists = await CbAdmins.exists(knex, { where: { name: 'Gordon' } });
      expect(exists).toBe(true);
    });

    test('exists :: returns false for non-existent cb-admin', async () => {
      const exists = await CbAdmins.exists(knex, { where: { name: 'Chell' } });
      expect(exists).toBe(false);
    });

    test('fromOrganisation :: returns admin for given organisation', async () => {
      const [admin] = await CbAdmins.fromOrganisation(knex, { id: 1 });
      expect(admin).toEqual(expect.objectContaining({ name: 'GlaDos' }));
    });
  });

  describe('Write', () => {
    test('add :: create new record using minimal information', async () => {
      const changeset = await factory.build('cbAdmin');
      const admin = await CbAdmins.add(trx, changeset);
      const passwordCheck = await compare(changeset.password, admin.password);

      expect(admin).toEqual(expect.objectContaining(omit(['password'], changeset)));
      expect(passwordCheck).toBeTruthy();
    });

    test('update :: non-foreign key column', async () => {
      const changeset = { email: 'newmail@foo.com' };
      const admin = await CbAdmins.getOne(trx, { where: { id: 2 } });

      const updatedAdmin = await CbAdmins.update(trx, admin, changeset);

      expect(updatedAdmin).toEqual(expect.objectContaining(changeset));
    });

    test('update :: foreign key column', async () => {
      const changeset = { disability: DisabilityEnum.NO };
      const admin = await CbAdmins.getOne(trx, { where: { id: 2 } });

      const updatedAdmin = await CbAdmins.update(trx, admin, changeset);

      expect(updatedAdmin).toEqual(expect.objectContaining(changeset));
    });

    test('update :: failed update on foreign key column', async () => {
      expect.assertions(1);

      const changeset = <any> { gender: 'non-existent' };
      const admin = await CbAdmins.getOne(trx, { where: { id: 2 } });

      try {
        await CbAdmins.update(trx, admin, changeset);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('destroy :: marks record as deleted', async () => {
      const admins = await CbAdmins.get(trx, { where: { deletedAt: null } });

      await CbAdmins.destroy(trx, admins[0]);
      const adminsAfterDel = await CbAdmins.get(trx, { where: { deletedAt: null } });
      const deletedAdmins = await CbAdmins.get(trx, { whereNot: { deletedAt: null } });
      const deletedAdmin = await CbAdmins.getOne(trx, { where: { id: admins[0].id } });

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
      expect(deletedAdmin.deletedAt).not.toEqual(null);
    });

    test('addTemporaryWithRole :: creates a new temporary marked cb_admin', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Black Mesa Research' } });
      const admin = await CbAdmins.addTemporaryWithRole(trx, cb);
      const emailCheck = /welcome-\d*@twine-together.com/.test(admin.email);
      const passwordCheck =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$£€%&()*+,\-./\\:;<=>@[\]^_{|}~? ])(?=.{8,})/
        .test(admin.password);
      const rolesCheck = await Roles
       .userHasAtCb(trx, { role: RoleEnum.CB_ADMIN, userId: admin.id, organisationId: cb.id });
      expect(emailCheck).toBeTruthy();
      expect(passwordCheck).toBeTruthy();
      expect(rolesCheck).toBeTruthy();
    });

    test('addTemporaryWithRole :: increments counter in faux email', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Black Mesa Research' } });
      const newCbAdmin = await CbAdmins.addTemporaryWithRole(trx, cb);
      const newCbAdmin2 = await CbAdmins.addTemporaryWithRole(trx, cb);
      expect(newCbAdmin.email).toBe('welcome-1@twine-together.com');
      expect(newCbAdmin2.email).toBe('welcome-2@twine-together.com');
    });

    test('addTemporaryWithRole :: counter increments based on lasted addition', async () => {

      /*
       * NOTE:
       * This test will not work with more than 2 new temp accounts as counter is
       * determined by created_at date, which is the same for all rows in transaction
       */

      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Black Mesa Research' } });
      await CbAdmins.addTemporaryWithRole(trx, cb);
      const newCbAdmin2 = await CbAdmins.addTemporaryWithRole(trx, cb);

      expect(newCbAdmin2.email).toBe('welcome-2@twine-together.com');
      await trx('user_account')
        .del()
        .where({ user_account_id: newCbAdmin2.id });
      const newCbAdmin3 = await CbAdmins.addTemporaryWithRole(trx, cb);
      expect(newCbAdmin3.email).toBe('welcome-2@twine-together.com');
    });
  });

  describe('Serialisation', () => {
    test('serialise :: returns model object without secrets', async () => {
      const admin = await CbAdmins.getOne(knex);

      const serialised = await CbAdmins.serialise(admin);

      expect(serialised).toEqual(omit(['password', 'qrCode'], admin));
    });
  });
});
