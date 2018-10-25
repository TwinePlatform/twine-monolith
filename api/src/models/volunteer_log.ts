import * as Knex from 'knex';
import { assoc, compose, evolve, has, filter, invertObj, omit, pick } from 'ramda';
import { VolunteerLog, VolunteerLogCollection } from './types';
import { CommunityBusinesses } from './community_business';
import { applyQueryModifiers } from './applyQueryModifiers';
import { renameKeys, mapKeys } from '../utils';
import { Map, Dictionary } from '../types/internal';
import Duration from './duration';
import Roles from '../auth/roles';
import { RoleEnum } from '../auth/types';


/*
 * Field name mappings
 *
 * ColumnToModel - DB column names       -> keys of the User type
 * ModelToColumn - keys of the User type -> DB column names
 */
export const ColumnToModel: Map<string, keyof VolunteerLog> = {
  'volunteer_hours_log.volunteer_hours_log_id': 'id',
  'volunteer_hours_log.user_account_id': 'userId',
  'volunteer_hours_log.organisation_id': 'organisationId',
  'volunteer_hours_log.duration': 'duration',
  'volunteer_hours_log.started_at': 'startedAt',
  'volunteer_hours_log.created_at': 'createdAt',
  'volunteer_hours_log.modified_at': 'modifiedAt',
  'volunteer_hours_log.deleted_at': 'deletedAt',
  'volunteer_activity.volunteer_activity_name': 'activity',
};
export const ModelToColumn = invertObj(ColumnToModel);

const optionalFields: Dictionary<string> = {
  organisationName: 'organisation.organisation_name',
};

const stripTablePrefix = mapKeys((s) => s.replace('volunteer_hours_log.', ''));

const replaceConstantsWithForeignKeys = renameKeys({
  'volunteer_activity.volunteer_activity_name': 'volunteer_hours_log.volunteer_activity_id',
});

const transformForeignKeysToSubQueries = (client: Knex) => evolve({
  'volunteer_hours_log.volunteer_activity_id': (s: string) =>
    client('volunteer_activity')
      .select('volunteer_activity_id')
      .where({ volunteer_activity_name: s }),
});

const transformDuration = evolve({
  duration: Duration.toSeconds,
});

const dropUnwhereableUserFields = omit([
  'createdAt',
  'modifiedAt',
  'deletedAt',
]);

export const VolunteerLogs: VolunteerLogCollection = {
  toColumnNames (o = {}) {
    return filter(
      (s) => typeof s !== 'undefined',
      Object.entries(ColumnToModel)
        .reduce((acc, [k, v]) => has(v, o) ? assoc(k, o[v], acc) : acc, {})
    );
  },

  create (o) {
    return {
      id: o.id,
      userId: o.userId,
      organisationId: o.organisationId,
      duration: o.duration,
      startedAt: o.startedAt,
      createdAt: o.createdAt,
      modifiedAt: o.modifiedAt,
      deletedAt: o.deletedAt,
      activity: o.activity,
    };
  },

  async get (client, q = {}) {
    const query = evolve({
      where: VolunteerLogs.toColumnNames,
      whereNot: VolunteerLogs.toColumnNames,
      whereBetween: VolunteerLogs.toColumnNames,
    }, q);

    return applyQueryModifiers(
      client('volunteer_hours_log')
        .innerJoin(
          'volunteer_activity',
          'volunteer_activity.volunteer_activity_id',
          'volunteer_hours_log.volunteer_activity_id')
        .innerJoin(
          'organisation',
          'volunteer_hours_log.organisation_id',
          'organisation.organisation_id'
        )
        .select(query.fields
          ? pick(query.fields, { ...ModelToColumn, ...optionalFields })
          : ModelToColumn),
      query
    );
  },

  async getOne (client, q = {}) {
    const [res] = await VolunteerLogs.get(client, { ...q, limit: 1 });
    return res || null;
  },

  async exists (client, query) {
    return null !== await VolunteerLogs.getOne(client, query);
  },

  async add (client, log) {
    const isVolunteer = await Roles.userHas(client, {
      userId: log.userId,
      organisationId: log.organisationId,
      role: [RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN],
    });

    const isCB = await CommunityBusinesses.exists(client, { where: { id: log.organisationId } });

    if (!isVolunteer || !isCB) {
      throw new Error('Volunteer logs must be registered against volunteer and community business');
    }

    const preProcessLog = compose(
      stripTablePrefix,
      transformForeignKeysToSubQueries(client),
      replaceConstantsWithForeignKeys,
      VolunteerLogs.toColumnNames,
      transformDuration
    );

    const [id] = await client('volunteer_hours_log')
      .insert(preProcessLog(log))
      .returning('volunteer_hours_log_id');

    if (!id) {
      throw new Error('Failed to insert volunteer log');
    }

    return VolunteerLogs.getOne(client, { where: { id } });
  },

  async update (client, log, changes) {
    const preProcessChangeSet = compose(
      stripTablePrefix,
      transformForeignKeysToSubQueries(client),
      replaceConstantsWithForeignKeys,
      VolunteerLogs.toColumnNames,
      transformDuration
    );

    const preProcessLog = compose(
      preProcessChangeSet,
      dropUnwhereableUserFields
    );

    const [id] = await client('volunteer_hours_log')
      .update(preProcessChangeSet(changes))
      .where(preProcessLog(log))
      .returning('volunteer_hours_log_id');

    if (!id) {
      throw new Error('Unable to perform update');
    }

    return VolunteerLogs.getOne(client, { where: { id } });
  },

  async destroy (client, log) {
    const preProcessLog = compose(
      transformForeignKeysToSubQueries(client),
      replaceConstantsWithForeignKeys,
      VolunteerLogs.toColumnNames,
      dropUnwhereableUserFields
    );

    return client('volunteer_hours_log')
      .update({
        deleted_at: new Date(),
      })
      .where(preProcessLog(log));
  },

  async fromUser (client, user, bw = {}) {
    return VolunteerLogs.get(client, {
      where: { userId: user.id, deletedAt: null },
      whereBetween: bw.since || bw.until
        ? {
          startedAt: [
            bw.since || new Date(0),
            bw.until || new Date(),
          ],
        }
        : undefined,
    });
  },

  async fromCommunityBusiness (client, cb, bw = {}) {
    return VolunteerLogs.get(client, {
      where: {
        organisationId: cb.id,
        deletedAt: null,
      },
      whereBetween: bw.since || bw.until
        ? {
          startedAt: [
            bw.since || new Date(0),
            bw.until || new Date(),
          ],
        }
        : undefined,
    });
  },

  async fromUserAtCommunityBusiness (client, user, cb, bw = {}) {
    return VolunteerLogs.get(client, {
      where: {
        organisationId: cb.id,
        userId: user.id,
        deletedAt: null,
      },
      whereBetween: bw.since || bw.until
        ? {
          startedAt: [
            bw.since || new Date(0),
            bw.until || new Date(),
          ],
        }
        : undefined,
    });
  },

  async serialise (log) {
    return log;
  },
};
