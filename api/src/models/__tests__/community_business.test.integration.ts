import * as Knex from 'knex';
import { getConfig } from '../../../config';
import factory from '../../../tests/utils/factory';
import { CommunityBusinesses } from '..';
import { getTrx } from '../../../tests/utils/database';


describe('Community Business Model', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);
  let trx: Knex.Transaction;

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
      const orgs = await CommunityBusinesses.get(knex);

      expect(orgs.length).toBe(2);
      expect(orgs).toEqual(expect.arrayContaining([
        expect.objectContaining({
          name: 'Aperture Science',
          _360GivingId: 'GB-COH-3205',
        })]));
    });

    test('get :: filter orgs by ID | non-existent ID resolves to empty array', async () => {
      const orgs = await CommunityBusinesses.get(knex, { where: { id: 200 } });
      expect(orgs).toEqual([]);
    });

    test('getOne :: returns first organisation only', async () => {
      const org = await CommunityBusinesses.getOne(knex);

      expect(org).toEqual(expect.objectContaining({
        name: 'Aperture Science',
        _360GivingId: 'GB-COH-3205',
      }));
    });

    test('getOne :: returns null for non-existent organisation', async () => {
      const org = await CommunityBusinesses.getOne(knex, { where: { id: 300 } });
      expect(org).toEqual(null);
    });

    test('exists :: returns true for existent user', async () => {
      const exists = await CommunityBusinesses.exists(knex, {
        where: { name: 'Aperture Science' },
      });
      expect(exists).toBe(true);
    });

    test('exists :: returns false for non-existent user', async () => {
      const exists = await CommunityBusinesses.exists(knex, {
        where: { name: 'Umbrella Corporation' },
      });
      expect(exists).toBe(false);
    });
  });

  describe('Write', () => {
    test('add :: create new record using minimal changeset', async () => {
      const changeset = await factory.build('communityBusiness');

      const org = await CommunityBusinesses.add(trx, changeset);

      expect(org).toEqual(expect.objectContaining(changeset));
    });

    test('update :: modify value in local table', async () => {
      const changeset = { logoUrl: 'foo' };
      const org = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });

      const updatedOrg = await CommunityBusinesses.update(trx, org, changeset);

      expect(updatedOrg.name).toEqual(org.name);
      expect(updatedOrg.logoUrl).toEqual('foo');
      expect(updatedOrg.modifiedAt).not.toEqual(null);
    });

    test('update :: modify foreign value', async () => {
      const changeset = { _360GivingId: 'foo' };
      const org = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });

      const updatedOrg = await CommunityBusinesses.update(trx, org, changeset);

      expect(updatedOrg.name).toEqual(org.name);
      expect(updatedOrg._360GivingId).toEqual('foo');
      expect(updatedOrg.modifiedAt).toEqual(null);
    });

    test('update :: invalid foreign value', async () => {
      expect.assertions(1);

      const changeset = { region: 'Narnia' };
      const org = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });

      try {
        await CommunityBusinesses.update(trx, org, changeset);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('destroy :: mark existing record as deleted', async () => {
      const org = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });

      const orgsBeforeDelete =
        await CommunityBusinesses.get(trx, { where: { deletedAt: null } });

      await CommunityBusinesses.destroy(trx, org);

      const orgsAfterDelete =
        await CommunityBusinesses.get(trx, { where: { deletedAt: null } });
      const deletedOrgs =
        await CommunityBusinesses.get(trx, { whereNot: { deletedAt: null } });

      expect(orgsAfterDelete).toHaveLength(orgsBeforeDelete.length - 1);
      expect(deletedOrgs).toHaveLength(1);
      expect(deletedOrgs[0].id).toBe(1);
      expect(deletedOrgs[0].modifiedAt).not.toEqual(null);
      expect(deletedOrgs[0].deletedAt).not.toEqual(null);
    });
  });

  describe('Serialisation', () => {
    test('serialise :: return full model', async () => {
      const org = await CommunityBusinesses.getOne(knex);

      const orgJson = await CommunityBusinesses.serialise(org);

      expect(orgJson).toEqual(org);
    });
  });

  describe('Feedback', () => {
    test('addFeedback :: insert positive feedback', async () => {
      const org = await CommunityBusinesses.getOne(trx);
      const fb = await trx('visit_feedback').select().where({ organisation_id: org.id });

      await CommunityBusinesses.addFeedback(trx, org, 1);

      const res = await trx('visit_feedback').select().where({ organisation_id: org.id });

      expect(res).toHaveLength(fb.length + 1);
      expect(res.slice(-1)[0].score).toBe(1);
    });

    test('getFeedback :: retrieve all added feedback', async () => {
      const org = await CommunityBusinesses.getOne(trx);
      const fb = await trx('visit_feedback').select().where({ organisation_id: org.id });

      await CommunityBusinesses.addFeedback(trx, org, 1);
      await CommunityBusinesses.addFeedback(trx, org, 0);
      await CommunityBusinesses.addFeedback(trx, org, 0);
      await CommunityBusinesses.addFeedback(trx, org, -1);

      const feedback = await CommunityBusinesses.getFeedback(trx, org);

      expect(feedback).toHaveLength(fb.length + 4);
      expect(feedback.slice(-4)[0].score).toBe(1);
    });

    test('getFeedback :: retrieve feedback added between timestamps', async () => {
      const org = await CommunityBusinesses.getOne(trx);

      const d1 = new Date('2018-07-29T00:00:00.000Z');
      const d2 = new Date('2018-08-01T00:00:00.000Z');
      const d3 = new Date(Date.now());

      const feedback12 = await CommunityBusinesses.getFeedback(trx, org, { since: d1, until: d2 });
      const feedback13 = await CommunityBusinesses.getFeedback(trx, org, { since: d1, until: d3 });
      const feedback23 = await CommunityBusinesses.getFeedback(trx, org, { since: d2, until: d3 });

      expect(feedback12).toHaveLength(6);
      expect(feedback12.map((f) => f.score)).toEqual([-1, 0, 0, 1, -1, 0]);

      expect(feedback13).toHaveLength(9);
      expect(feedback13.map((f) => f.score)).toEqual([-1, 0, 0, 1, -1, 0, 0, 1, 1]);

      expect(feedback23).toHaveLength(3);
      expect(feedback23.map((f) => f.score)).toEqual([0, 1, 1]);
    });
  });

  describe('getVisitLogsWithUsers', () => {
    test(':: returns all logs for a cb', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
      const logs = await CommunityBusinesses.getVisitLogsWithUsers(trx, cb);
      expect(logs.length).toEqual(10);
      expect(logs).toEqual(expect.arrayContaining([
        expect.objectContaining({
          visitActivity: 'Free Running',
          birthYear: 1988,
          category: 'Sports',
          gender: 'female',
          id: 1,
          userId: 1,
        }),
      ]));
    });

    test(':: returns subset of logs when a query is supplied', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
      const logs = await CommunityBusinesses
        .getVisitLogsWithUsers(trx, cb, { where: { visitActivity: 'Wear Pink' } });

      expect(logs.length).toEqual(3);
    });


    test(':: returns empty array when a cb with no logs is supplied', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 2 } });
      const logs = await CommunityBusinesses
        .getVisitLogsWithUsers(trx, cb);

      expect(logs.length).toEqual(0);
    });
  });

  describe('getAggregatedVisitLogs', () => {
    test(':: returns all aggregated logs for a cb', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
      const aggregates = await CommunityBusinesses
        .getVisitLogAggregates(trx, cb, ['gender', 'age', 'visitActivity']);
      expect(aggregates).toEqual({
        visitActivity: { 'Free Running': '7', 'Wear Pink': '3' },
        age: { '18-34': '10' },
        gender: { female: '10' },
      });
    });

    test(':: returns subset of aggregates when a query is supplied', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
      const logs = await CommunityBusinesses.getVisitLogAggregates(
        trx,
        cb,
        ['gender', 'visitActivity', 'age'],
        { where: { visitActivity: 'Wear Pink' } }
        );

      expect(logs).toEqual({
        visitActivity: { 'Wear Pink': '3' },
        age: { '18-34': '3' },
        gender: { female: '3' } });
    });

    test(':: throws an error if unsupported aggregate fields are supplied', async () => {
      expect.assertions(1);
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
      try {
        await CommunityBusinesses.getVisitLogAggregates(
          trx,
          cb,
          ['gender', 'visitActivity', 'age', 'funkability']
          );
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });
});
