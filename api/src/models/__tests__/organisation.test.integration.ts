import * as Knex from 'knex';
import { getConfig } from '../../../config';
import { getTrx } from '../../../tests/utils/database';
import factory from '../../../tests/utils/factory';
import { Organisations } from '..';
import { Users } from '../user';


describe('Organisation Model', () => {
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
    test('get :: no arguments gets all orgs', async () => {
      const orgs = await Organisations.get(knex);

      expect(orgs.length).toBe(3);
      expect(orgs[0]).toEqual(expect.objectContaining({
        name: 'Aperture Science',
        _360GivingId: 'GB-COH-3205',
      }));
    });

    test('get :: filter orgs by ID | non-existent ID resolves to empty array', async () => {
      const orgs = await Organisations.get(knex, { where: { id: 2000 } });
      expect(orgs).toEqual([]);
    });

    test('getOne :: returns first organisation only', async () => {
      const org = await Organisations.getOne(knex);

      expect(org).toEqual(expect.objectContaining({
        name: 'Aperture Science',
        _360GivingId: 'GB-COH-3205',
      }));
    });

    test('getOne :: returns null for non-existent organisation', async () => {
      const org = await Organisations.getOne(knex, { where: { id: 300 } });
      expect(org).toEqual(null);
    });

    test('exists :: returns true for existent user', async () => {
      const exists = await Organisations.exists(knex, { where: { name: 'Aperture Science' } });
      expect(exists).toBe(true);
    });

    test('exists :: returns false for non-existent user', async () => {
      const exists = await Organisations.exists(knex, { where: { name: 'foo' } });
      expect(exists).toBe(false);
    });

    test('fromUser :: returns organisation details for existing user email', async () => {
      const result =
        await Organisations.fromUser(knex, { where: { email: '1498@aperturescience.com' } });
      expect(result).toEqual(
        expect.objectContaining({ _360GivingId: 'GB-COH-3205', name: 'Aperture Science' }));
    });

    test('fromUser :: returns null for non-existing user email', async () => {
      const result =
          await Organisations.fromUser(knex, { where: { email: 'freedom@aperturescience.com' } });
      expect(result).toBeNull();
    });

    test('fromUser :: works with a full user object', async () => {
      const user = await Users.getOne(knex, { where: { name: 'GlaDos' } });
      const result = await Organisations.fromUser(knex, { where: user });
      expect(result).toEqual(
        expect.objectContaining({ _360GivingId: 'GB-COH-3205', name: 'Aperture Science' }));
    });
  });

  describe('Write', () => {
    test('add :: create new record using minimal changeset', async () => {
      const changeset = await factory.build('organisation');

      const org = await Organisations.add(trx, changeset);

      expect(org).toEqual(expect.objectContaining(changeset));
    });

    test('update :: modify existing record', async () => {
      const changeset = { _360GivingId: 'foo' };
      const org = await Organisations.getOne(trx, { where: { id: 1 } });

      const updatedOrg = await Organisations.update(trx, org, changeset);

      expect(updatedOrg.name).toEqual(org.name);
      expect(updatedOrg._360GivingId).toEqual('foo');
      expect(updatedOrg.modifiedAt).not.toEqual(null);
    });

    test('destroy :: mark existing record as deleted', async () => {
      const org = await Organisations.getOne(trx, { where: { id: 1 } });

      const orgsBeforeDelete = await Organisations.get(trx, { where: { deletedAt: null } });
      await Organisations.destroy(trx, org);

      const orgsAfterDelete = await Organisations.get(trx, { where: { deletedAt: null } });
      const deletedOrgs = await Organisations.get(trx, { whereNot: { deletedAt: null } });

      expect(orgsAfterDelete).toHaveLength(orgsBeforeDelete.length - 1);
      expect(deletedOrgs).toHaveLength(1);
      expect(deletedOrgs[0].id).toBe(1);
      expect(deletedOrgs[0].modifiedAt).not.toEqual(null);
      expect(deletedOrgs[0].deletedAt).not.toEqual(null);
    });
  });

  describe('Serialisation', () => {
    test('serialise :: return full model', async () => {
      const org = await Organisations.getOne(trx);

      const orgJson = await Organisations.serialise(org);

      expect(orgJson).toEqual(org);
    });
  });
});
