import * as Knex from 'knex';
import { getConfig } from '../../../config';
import { getTrx } from '../../../tests/database';
import factory from '../../../tests/factory';
import { Organisations } from '..';


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

      expect(orgs.length).toBe(1);
      expect(orgs[0]).toEqual(expect.objectContaining({
        name: 'Aperture Science',
        _360GivingId: '01111000',
      }));
    });

    test('get :: filter orgs by ID | non-existent ID resolves to empty array', async () => {
      const orgs = await Organisations.get(knex, { where: { id: 2 } });
      expect(orgs).toEqual([]);
    });

    test('getOne :: returns first organisation only', async () => {
      const org = await Organisations.getOne(knex);

      expect(org).toEqual(expect.objectContaining({
        name: 'Aperture Science',
        _360GivingId: '01111000',
      }));
    });

    test('getOne :: returns null for non-existent organisation', async () => {
      const org = await Organisations.getOne(knex, { where: { id: 300 } });
      expect(org).toEqual(null);
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

      await Organisations.destroy(trx, org);

      const orgsAfterDelete = await Organisations.get(trx, { where: { deletedAt: null } });
      const deletedOrgs = await Organisations.get(trx, { whereNot: { deletedAt: null } });

      expect(orgsAfterDelete).toHaveLength(0);
      expect(deletedOrgs).toHaveLength(1);
      expect(deletedOrgs[0].id).toBe(1);
    });
  });

  describe('Serialisation', () => {
    test('serialise :: return full model', async () => {
      const org = await Organisations.getOne(trx);

      const orgJson = Organisations.serialise(org);

      expect(orgJson).toEqual(org);
    });
  });
});
