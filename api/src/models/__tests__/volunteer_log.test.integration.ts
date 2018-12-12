import * as Knex from 'knex';
import * as moment from 'moment';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import { getTrx } from '../../../tests/utils/database';
import { VolunteerLogs, Users, CommunityBusinesses } from '..';


describe('VolunteerLog model', () => {
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
    test('get :: returns volunteer logs', async () => {
      const logs = await VolunteerLogs.get(trx);
      expect(logs).toHaveLength(10);
      expect(logs).toEqual(expect.arrayContaining([
        expect.objectContaining({
          userId: 6,
          organisationId: 2,
          activity: 'Office support',
          duration: { minutes: 50, seconds: 59 },
        }),
      ]));
    });

    test('get :: no deleted logs', async () => {
      const logs = await VolunteerLogs.get(trx, { whereNot: { deletedAt: null } });
      expect(logs).toHaveLength(0);
    });

    test('get :: additional fields', async () => {
      const logs = await VolunteerLogs.get(trx, {
        fields: ['userName', 'organisationName'],
      });
      expect(logs).toEqual(expect.arrayContaining(
        [{ organisationName: 'Black Mesa Research', userName: 'Emma Emmerich' }]
      ));
    });

    test('getOne :: returns first log', async () => {
      const logs = await VolunteerLogs.getOne(trx, { order: ['startedAt', 'asc'] });
      expect(logs).toEqual(expect.objectContaining({
        userId: 7,
        organisationId: 2,
        activity: 'Helping with raising funds (shop, events…)',
        duration: { minutes: 35 },
      }));
    });

    test('exists :: returns true for existent log', async () => {
      const exists = await VolunteerLogs.exists(trx, { where: { userId: 6 } });
      expect(exists).toBe(true);
    });

    test('exists :: returns false for non-existent visitor', async () => {
      const exists = await VolunteerLogs.exists(trx, { where: { organisationId: 3 } });
      expect(exists).toBe(false);
    });

    test('fromCommunityBusiness :: gets all logs at CB', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Black Mesa Research' } });
      const logs = await VolunteerLogs.fromCommunityBusiness(trx, cb);

      expect(logs).toHaveLength(9);
      expect(logs).toEqual(expect.arrayContaining([
        expect.objectContaining({
          userId: 6,
          organisationId: cb.id,
          activity: 'Office support',
          duration: { minutes: 50, seconds: 59 },
        }),
      ]));
    });

    test('fromCommunityBusiness :: gets all logs at CB between dates', async () => {
      const now = moment();
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Black Mesa Research' } });
      const query = {
        since: now.clone().subtract(6, 'day').startOf('day').toDate(),
        until: now.clone().subtract(4, 'day').startOf('day').toDate(),
      };
      const logs = await VolunteerLogs.fromCommunityBusiness(trx, cb, query);

      expect(logs).toHaveLength(2);
      expect(logs).toEqual(expect.arrayContaining([
        expect.objectContaining({
          userId: 6,
          organisationId: cb.id,
          activity: 'Outdoor and practical work',
          duration: { hours: 5 },
        }),
      ]));
    });

    test('fromUser :: returns volunteer logs for user', async () => {
      const volunteer = await Users.getOne(trx, { where: { name: 'Emma Emmerich' } });
      const logs = await VolunteerLogs.fromUser(trx, volunteer);

      expect(logs).toHaveLength(8);
      expect(logs).toEqual(expect.arrayContaining([
        expect.objectContaining({
          userId: volunteer.id,
          organisationId: 2,
          activity: 'Outdoor and practical work',
          duration: { hours: 5 },
        }),
      ]));
    });

    test('fromUser :: returns volunteer logs for user between dates', async () => {
      const now = moment();
      const volunteer = await Users.getOne(trx, { where: { name: 'Emma Emmerich' } });
      const query = {
        since: now.clone().subtract(6, 'day').startOf('day').toDate(),
        until: now.clone().subtract(4, 'day').startOf('day').toDate(),
      };
      const logs = await VolunteerLogs.fromUser(trx, volunteer, query);

      expect(logs).toHaveLength(2);
      expect(logs).toEqual(expect.arrayContaining([
        expect.objectContaining({
          userId: volunteer.id,
          organisationId: 2,
          activity: 'Outdoor and practical work',
          duration: { hours: 5 },
        }),
      ]));
    });

    test('fromUser :: returns no volunteer logs for non-volunteer', async () => {
      const notVolunteer = await Users.getOne(trx, { where: { name: 'Big Boss' } });
      const logs = await VolunteerLogs.fromUser(trx, notVolunteer);
      expect(logs).toHaveLength(0);
    });

    test('fromUserAtCommunityBusiness :: returns volunteer logs only at given CB', async () => {
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Aperture Science' } });
      const volunteer = await Users.getOne(trx, { where: { name: 'Emma Emmerich' } });
      const logs = await VolunteerLogs.fromUserAtCommunityBusiness(trx, volunteer, cb);

      expect(logs).toHaveLength(1);
      expect(logs).toEqual(expect.arrayContaining([
        expect.objectContaining({
          userId: volunteer.id,
          organisationId: cb.id,
          activity: 'Office support',
          duration: { minutes: 30 },
        }),
      ]));
    });
  });

  describe('Write', () => {
    test('add :: create new record using minimal information', async () => {
      const now = new Date();
      const res = await VolunteerLogs.add(trx, {
        userId: 6,
        organisationId: 2,
        activity: 'Office support',
        duration: { minutes: 100 },
        startedAt: now.toDateString(),
      });

      expect(res).toEqual(expect.objectContaining({
        activity: 'Office support',
        duration: { hours: 1, minutes: 40 },
        startedAt: new Date(now.toDateString()),
      }));
    });

    test('add :: cannot create record with non-volunteer user', async () => {
      expect.assertions(1);
      const now = new Date();

      try {
        await VolunteerLogs.add(trx, {
          userId: 1,
          organisationId: 2,
          activity: 'Office support',
          duration: { minutes: 100 },
          startedAt: now.toDateString(),
        });
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('add :: cannot create record with non-cb organisation id', async () => {
      expect.assertions(1);
      const now = new Date();

      try {
        await VolunteerLogs.add(trx, {
          userId: 1,
          organisationId: 3,
          activity: 'Office support',
          duration: { minutes: 100 },
          startedAt: now.toDateString(),
        });
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('add :: with valid project', async () => {
      const now = new Date();

      const res = await VolunteerLogs.add(trx, {
        userId: 6,
        organisationId: 2,
        activity: 'Office support',
        duration: { minutes: 100 },
        project: 'Take over the world',
        startedAt: now.toISOString(),
      });

      expect(res).toEqual(expect.objectContaining({
        userId: 6,
        organisationId: 2,
        activity: 'Office support',
        duration: { hours: 1, minutes: 40 },
        project: 'Take over the world',
        startedAt: now,
      }));
    });

    test('add :: invalid project is ignored', async () => {
      const now = new Date();

      const res = await VolunteerLogs.add(trx, {
        userId: 6,
        organisationId: 2,
        activity: 'Office support',
        duration: { minutes: 100 },
        project: 'Non-existent',
        startedAt: now.toISOString(),
      });

      expect(res).toEqual(expect.objectContaining({
        userId: 6,
        organisationId: 2,
        activity: 'Office support',
        duration: { hours: 1, minutes: 40 },
        startedAt: now,
      }));
      expect(res.project).toEqual(null);
    });

    test('add :: with duplicate deleted project', async () => {
      const now = new Date();
      const cb = await CommunityBusinesses.getOne(trx, { where: { id: 2 } });
      const projects = await VolunteerLogs.getProjects(trx, cb);
      await VolunteerLogs.deleteProject(trx, projects[0]);
      const project = await VolunteerLogs.addProject(trx, cb, projects[0].name);

      const log = await VolunteerLogs.add(trx, {
        userId: 6,
        organisationId: 2,
        activity: 'Office support',
        duration: { minutes: 100 },
        project: project.name,
        startedAt: now.toISOString(),
      });

      expect(log).toEqual(expect.objectContaining({
        userId: 6,
        organisationId: 2,
        activity: 'Office support',
        duration: { hours: 1, minutes: 40 },
        project: project.name,
        startedAt: now,
      }));
    });

    test('add :: with deleted activity', async () => {
      expect.assertions(2);
      const now = new Date();

      const res = await trx('volunteer_activity')
        .update({ deleted_at: now })
        .where({ volunteer_activity_name: 'Office support' });

      expect(res).toBe(1);

      try {
        await VolunteerLogs.add(trx, {
          userId: 6,
          organisationId: 2,
          activity: 'Office support',
          duration: { minutes: 100 },
          startedAt: now.toISOString(),
        });
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('update :: non-foreign key column', async () => {
      const log = await VolunteerLogs.getOne(trx, { where: { activity: 'Office support' } });
      const changes = { duration: { hours: 1, minutes: 1 } };

      const logUpdated = await VolunteerLogs.update(trx, log, changes);

      expect(logUpdated.duration).toEqual(changes.duration);
      expect(log.modifiedAt).not.toBe(logUpdated.modifiedAt);
      expect(omit(['modifiedAt', 'duration'], log))
        .toEqual(omit(['modifiedAt', 'duration'], logUpdated));
    });

    test('update :: foreign key column', async () => {
      const log = await VolunteerLogs.getOne(trx, { where: { activity: 'Office support' } });
      const changes = { activity: 'Outdoor and practical work' };

      const logUpdated = await VolunteerLogs.update(trx, log, changes);

      expect(logUpdated.activity).toBe(changes.activity);
      expect(log.modifiedAt).not.toBe(logUpdated.modifiedAt);
      expect(omit(['modifiedAt', 'activity'], log))
        .toEqual(omit(['modifiedAt', 'activity'], logUpdated));
    });

    test('update :: failed update on foreign key column', async () => {
      expect.assertions(1);
      const log = await VolunteerLogs.getOne(trx, { where: { activity: 'Office support' } });
      const changes = { activity: 'Nope' };

      try {
        await VolunteerLogs.update(trx, log, changes);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('destroy :: marks record as deleted', async () => {
      const log = await VolunteerLogs.getOne(trx, { where: { activity: 'Office support' } });

      const res = await VolunteerLogs.destroy(trx, log);

      const reGetLog = await VolunteerLogs.getOne(trx, { where: log });

      expect(reGetLog).toBeNull();
      expect(res).toBe(1);
    });
  });

  describe('Serialisation', () => {
    test('serialise :: returns model object without secrets', async () => {
      const log = await VolunteerLogs.getOne(trx, { where: { activity: 'Office suport' } });
      const slog = await VolunteerLogs.serialise(log);
      expect(log).toEqual(slog);
    });
  });

  describe('Projects', () => {
    describe('Read', () => {
      test('getProjects :: ', async () => {
        const cb = await CommunityBusinesses.getOne(knex, { where: { id: 1 } });
        const projects = await VolunteerLogs.getProjects(knex, cb);

        expect(projects).toHaveLength(2);
        expect(projects).toEqual([
          { name: 'Party' },
          { name: 'Community dinner' },
        ].map(expect.objectContaining));
      });
    });

    describe('Write', () => {
      test('addProject :: happy path', async () => {
        const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
        const project = await VolunteerLogs.addProject(trx, cb, 'foo');

        expect(project).toEqual(expect.objectContaining({
          name: 'foo',
          organisationId: 1,
        }));
      });

      test('addProject :: cannot add duplicates within CB', async () => {
        expect.assertions(1);

        const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
        await VolunteerLogs.addProject(trx, cb, 'foo');

        try {
          await VolunteerLogs.addProject(trx, cb, 'foo');
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });

      test('addProject :: can add duplicates across CBs', async () => {
        const cbOne = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
        const cbTwo = await CommunityBusinesses.getOne(trx, { where: { id: 2 } });
        const p1 = await VolunteerLogs.addProject(trx, cbOne, 'foo');
        const p2 = await VolunteerLogs.addProject(trx, cbTwo, 'foo');

        expect(p1.organisationId).toBe(1);
        expect(p2.organisationId).toBe(2);
        expect(omit(['id', 'organisationId'], p1)).toEqual(omit(['id', 'organisationId'], p2));
      });

      test('updateProject :: happy path', async () => {
        const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
        const [project] = await VolunteerLogs.getProjects(trx, cb);
        const updated = await VolunteerLogs.updateProject(trx, project, { name: 'NEW NAME' });

        expect(updated).toHaveLength(1);
        expect(updated[0]).toEqual(expect.objectContaining({
          ...omit(['modifiedAt'], project),
          name: 'NEW NAME',
        }));
        expect(updated[0].modifiedAt).not.toEqual(project.modifiedAt);
      });

      test('updateProject :: cannot update to existing (non-deleted) name', async () => {
        expect.assertions(1);

        const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
        const projects = await VolunteerLogs.getProjects(trx, cb);

        try {
          await VolunteerLogs.updateProject(trx, projects[0], { name: projects[1].name });
        } catch (error) {
          expect(error).toBeTruthy();
        }
      });

      test('updateProject :: can update to existing deleted name', async () => {
        const cb = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });
        const projects = await VolunteerLogs.getProjects(trx, cb);
        const num = await VolunteerLogs.deleteProject(trx, projects[1]);

        expect(num).toBe(1);

        const updated =
          await VolunteerLogs.updateProject(trx, projects[0], { name: projects[1].name });

        expect(updated).toHaveLength(1);
        expect(updated[0]).toEqual(expect.objectContaining({
          ...omit(['modifiedAt'], projects[0]),
          name: projects[1].name,
        }));
        expect(updated[0].modifiedAt).not.toEqual(projects[0].modifiedAt);
      });

      test('deleteProject :: ', async () => {
        const cb = await CommunityBusinesses.getOne(trx, { where: { id: 2 } });
        const p = await VolunteerLogs.getProjects(trx, cb);
        const projBefore = p.sort((a, b) => a.id - b.id);
        const logsBefore = await VolunteerLogs.get(trx, { where: { project: projBefore[0].name } });
        const numDeleted = await VolunteerLogs.deleteProject(trx, projBefore[0]);
        const projAfter = await VolunteerLogs.getProjects(trx, cb);
        const logsAfter = await VolunteerLogs.get(trx, { where: { project: projBefore[0].name } });

        expect(numDeleted).toBe(1);
        expect(projAfter).toHaveLength(projBefore.length - 1);
        expect(projAfter).toEqual(projBefore.slice(1));
        expect(logsBefore.length).toBeGreaterThan(0);
        expect(logsAfter.length).toBe(0);
      });
    });
  });
});
