import * as Knex from 'knex';
import { getConfig } from '../../../config';
import factory from '../../../tests/utils/factory';
import { CommunityBusinesses } from '..';
const { migrate } = require('../../../database');


describe('Community Business Model', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  afterAll(async () => {
    await knex.destroy();
  });

  beforeAll(async () => {
    await migrate.teardown({ client: knex });
    await knex.migrate.latest();
  });

  beforeEach(async () => {
    await migrate.truncate({ client: knex });
    await knex.seed.run();
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

      const org = await CommunityBusinesses.add(knex, changeset);

      expect(org).toEqual(expect.objectContaining(changeset));
    });

    test('update :: modify value in local table', async () => {
      const changeset = { logoUrl: 'foo' };
      const org = await CommunityBusinesses.getOne(knex, { where: { id: 1 } });

      const updatedOrg = await CommunityBusinesses.update(knex, org, changeset);

      expect(updatedOrg.name).toEqual(org.name);
      expect(updatedOrg.logoUrl).toEqual('foo');
      expect(updatedOrg.modifiedAt).not.toEqual(null);
    });

    test('update :: modify foreign value', async () => {
      const changeset = { _360GivingId: 'foo' };
      const org = await CommunityBusinesses.getOne(knex, { where: { id: 1 } });

      const updatedOrg = await CommunityBusinesses.update(knex, org, changeset);
      expect(updatedOrg.name).toEqual(org.name);
      expect(updatedOrg._360GivingId).toEqual('foo');
      expect(updatedOrg.modifiedAt).toEqual(null);
    });

    test('destroy :: mark existing record as deleted', async () => {
      const org = await CommunityBusinesses.getOne(knex, { where: { id: 1 } });

      const orgsBeforeDelete =
        await CommunityBusinesses.get(knex, { where: { deletedAt: null } });

      await CommunityBusinesses.destroy(knex, org);

      const orgsAfterDelete =
        await CommunityBusinesses.get(knex, { where: { deletedAt: null } });
      const deletedOrgs =
        await CommunityBusinesses.get(knex, { whereNot: { deletedAt: null } });

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
      const org = await CommunityBusinesses.getOne(knex);
      const fb = await knex('visit_feedback').select().where({ organisation_id: org.id });

      await CommunityBusinesses.addFeedback(knex, org, 1);

      const res = await knex('visit_feedback').select().where({ organisation_id: org.id });

      expect(res).toHaveLength(fb.length + 1);
      expect(res.slice(-1)[0].score).toBe(1);
    });

    test('getFeedback :: retrieve all added feedback', async () => {
      const org = await CommunityBusinesses.getOne(knex);
      const fb = await knex('visit_feedback').select().where({ organisation_id: org.id });

      await CommunityBusinesses.addFeedback(knex, org, 1);
      await CommunityBusinesses.addFeedback(knex, org, 0);
      await CommunityBusinesses.addFeedback(knex, org, 0);
      await CommunityBusinesses.addFeedback(knex, org, -1);

      const feedback = await CommunityBusinesses.getFeedback(knex, org);

      expect(feedback).toHaveLength(fb.length + 4);
      expect(feedback.slice(-4)[0].score).toBe(1);
    });

    test('getFeedback :: retrieve feedback added between timestamps', async () => {
      const org = await CommunityBusinesses.getOne(knex);

      const d1 = Date.now();
      await CommunityBusinesses.addFeedback(knex, org, 1);
      await CommunityBusinesses.addFeedback(knex, org, 0);
      await CommunityBusinesses.addFeedback(knex, org, -1);

      const d2 = Date.now();
      await CommunityBusinesses.addFeedback(knex, org, 0);

      const d3 = Date.now();

      const feedback12 = await CommunityBusinesses.getFeedback(
        knex, org, { since: new Date(d1), until: new Date(d2) });
      const feedback13 = await CommunityBusinesses.getFeedback(
        knex, org, { since: new Date(d1), until: new Date(d3) });
      const feedback23 = await CommunityBusinesses.getFeedback(
        knex, org, { since: new Date(d2), until: new Date(d3) });

      expect(feedback12).toHaveLength(3);
      expect(feedback12.map((f) => f.score)).toEqual([1, 0, -1]);

      expect(feedback13).toHaveLength(4);
      expect(feedback13.map((f) => f.score)).toEqual([1, 0, -1, 0]);

      expect(feedback23).toHaveLength(1);
      expect(feedback23.map((f) => f.score)).toEqual([0]);
    });
  });
});
