import * as Knex from 'knex';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import { getTrx } from '../../../tests/utils/database';
import { VolunteerProjects, CommunityBusinesses, VolunteerLogs } from '..';


describe('VolunteerProject model', () => {
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
    test('fromCommunityBusiness :: ', async () => {
      const cb = await CommunityBusinesses.getOne(knex, { where: { id: 1 } });
      const projects = await VolunteerProjects.fromCommunityBusiness(knex, cb);

      expect(projects).toHaveLength(2);
      expect(projects).toEqual([
        { name: 'Party' },
        { name: 'Community dinner' },
      ].map(expect.objectContaining));
    });

    test('getDefault :: ', async () => {
      const cb = await CommunityBusinesses.getOne(knex, { where: { id: 1 } });
      const project = await VolunteerProjects.getDefault(cb);

      expect(project).toEqual(expect.objectContaining({ id: 0, name: 'General', organisationId: 1 }));
    });
  });

  describe('Write', () => {
    test('add :: happy path', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
      const project = await VolunteerProjects.add(trx, cb, 'foo');

      expect(project).toEqual(expect.objectContaining({
        name: 'foo',
        organisationId: 1,
      }));
    });

    test('add :: cannot add duplicates within CB', async () => {
      expect.assertions(1);

      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
      await VolunteerProjects.add(trx, cb, 'foo');

      try {
        await VolunteerProjects.add(trx, cb, 'foo');
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('add :: can add duplicates across CBs', async () => {
      const cbOne = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
      const cbTwo = await CommunityBusinesses.getOne(trx, { where: { id: 2 } });
      const p1 = await VolunteerProjects.add(trx, cbOne, 'foo');
      const p2 = await VolunteerProjects.add(trx, cbTwo, 'foo');

      expect(p1.organisationId).toBe(1);
      expect(p2.organisationId).toBe(2);
      expect(omit(['id', 'organisationId'], p1)).toEqual(omit(['id', 'organisationId'], p2));
    });

    test('update :: happy path', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
      const [project] = await VolunteerProjects.fromCommunityBusiness(trx, cb);
      const updated = await VolunteerProjects.update(trx, project, { name: 'NEW NAME' });

      expect(updated).toHaveLength(1);
      expect(updated[0]).toEqual(expect.objectContaining({
        ...omit(['modifiedAt'], project),
        name: 'NEW NAME',
      }));
      expect(updated[0].modifiedAt).not.toEqual(project.modifiedAt);
    });

    test('update :: cannot update to existing (non-deleted) name', async () => {
      expect.assertions(1);

      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
      const projects = await VolunteerProjects.fromCommunityBusiness(trx, cb);

      try {
        await VolunteerProjects.update(trx, projects[0], { name: projects[1].name });
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('update :: can update to existing deleted name', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
      const projects = await VolunteerProjects.fromCommunityBusiness(trx, cb);
      const num = await VolunteerProjects.delete(trx, projects[1]);

      expect(num).toBe(1);

      const updated =
        await VolunteerProjects.update(trx, projects[0], { name: projects[1].name });

      expect(updated).toHaveLength(1);
      expect(updated[0]).toEqual(expect.objectContaining({
        ...omit(['modifiedAt'], projects[0]),
        name: projects[1].name,
      }));
      expect(updated[0].modifiedAt).not.toEqual(projects[0].modifiedAt);
    });

    test('delete :: ', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 2 } });
      const ps = await VolunteerProjects.fromCommunityBusiness(trx, cb);
      const projBefore = ps.sort((a, b) => a.id - b.id);
      const logsBefore = await VolunteerLogs.get(trx, { where: { project: projBefore[0].name } });
      const numDeleted = await VolunteerProjects.delete(trx, projBefore[0]);
      const projAfter = await VolunteerProjects.fromCommunityBusiness(trx, cb);
      const logsAfter = await VolunteerLogs.get(trx, { where: { project: projBefore[0].name } });

      expect(numDeleted).toBe(1);
      expect(projAfter).toHaveLength(projBefore.length - 1);
      expect(projAfter).toEqual(projBefore.slice(1));
      expect(logsBefore.length).toBeGreaterThan(0);
      expect(logsAfter.length).toBe(0);
    });
  });
});
