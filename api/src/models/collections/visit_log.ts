import * as Knex from 'knex';
import * as moment from 'moment';
import { toPairs, flatten, pick } from 'ramda';
import { Objects, Arrays } from 'twine-util';
import { isWhereBetween } from '../util';
import { VisitLogCollection } from '../types/collection';
import {
  WhereBetweenQuery,
  WhereQuery,
  ModelQuery,
  ModelQueryPartial,
  VisitLog,
  GenderEnum
} from '../types/index';
import * as R from '../types/records'
import { applyQueryModifiers } from '../query_util';
import { VisitActivities } from './visit_activity';
import { Visitors } from './visitors';



export const modelToRecordMap = {
  id: 'visit_log.visit_log_id' as keyof R.VisitLog,
  userId: 'visit_log.user_account_id' as keyof R.VisitLog,
  activityId: 'visit_log.visit_activity_id' as keyof R.VisitLog,
  createdAt: 'visit_log.created_at' as keyof R.VisitLog,
  modifiedAt: 'visit_log.modified_at' as keyof R.VisitLog,
  deletedAt: 'visit_log.deleted_at' as keyof R.VisitLog,
};

const returnAs = [
  'visit_log.visit_log_id AS id',
  'visit_log.visit_log_activity_id AS activityId',
  'visit_log.user_account_id AS userId',
  'visit_log.created_at AS createdAt',
  'visit_log.modified_at AS modifiedAt',
  'visit_log.deleted_at AS deletedAt',
];


export const VisitLogs: VisitLogCollection = {
  _toColumnNames(a: WhereQuery<VisitLog> | WhereBetweenQuery<VisitLog>): any {
    if (isWhereBetween(a)) {
      return Objects.renameKeys(modelToRecordMap)(a) as WhereBetweenQuery<R.VisitLog>;
    } else {
      return Objects.renameKeys(modelToRecordMap)(a) as WhereQuery<R.VisitLog>;
    }
  },

  cast(a) {
    return {
      __model: true,
      __tag: 'VisitLog',
      id: a.id,
      userId: a.name,
      activityId: a.categoryId,
      createdAt: a.createdAt,
      modifiedAt: a.modifiedAt,
      deletedAt: a.deletedAt,
    } as Partial<VisitLog>;
  },

  async get (client: Knex, query: ModelQuery<VisitLog> | ModelQueryPartial<VisitLog>) {
    const _q = {
      where: VisitLogs._toColumnNames(query.where),
      whereNot: VisitLogs._toColumnNames(query.whereNot),
      whereBetween: VisitLogs._toColumnNames(query.whereBetween),
      whereNotBetween: VisitLogs._toColumnNames(query.whereNotBetween),
      limit: query.limit,
      offset: query.offset,
    };

    const x = applyQueryModifiers<R.VisitLog, VisitLog[], R.VisitLog>(
      client<R.VisitLog, VisitLog[]>('visit_log'),
      _q
    );

    if ('fields' in query) {
      return x.select(pick(query.fields, modelToRecordMap)) as Knex.QueryBuilder<R.VisitLog, Partial<VisitLog>[]>;
    } else {
      return x.select(modelToRecordMap) as Knex.QueryBuilder<R.VisitLog, VisitLog[]>;
    }
  },

  async getOne (client: Knex, query: ModelQuery<VisitLog> | ModelQueryPartial<VisitLog>) {
    const [activity] = await VisitLogs.get(client, Object.assign(query, { limit: 1 }));
    return activity || null;
  },

  async exists (client, query) {
    return null !== VisitLogs.getOne(client, { where: query });
  },

  async create (client, log) {
    return client<R.VisitLog, VisitLog>('visit_log')
      .insert(
        {
          'visit_log.user_account_id': log.userId,
          'visit_log.visit_activity_id': log.activityId,
        },
        returnAs
      );
  },

  async update (client, target, changeset) {
    return applyQueryModifiers(
      client<R.VisitLog, VisitLog>('visit_log')
        .update(
          {
            'visit_log.visit_activity_id': changeset.activityId,
            'visit_log.user_account_id': changeset.userId,
          },
          returnAs
        ),
      target
    );
  },

  async delete (client, target) {
    return applyQueryModifiers(
      client<R.VisitLog, VisitLog>('visit_activity')
        .update({ 'visit_log.deleted_at': new Date() }, returnAs),
      target
    );
  },

  async destroy (client, target) {
    return applyQueryModifiers(
      client<R.VisitLog, VisitLog>('visit_activity')
        .delete()
        .returning(returnAs),
      target
    );
  },

  async add (client, activity, user) {
    return VisitLogs.create(
      client,
      { activityId: activity.id, userId: user.id }
    );
  },

  async fromCommunityBusiness(client, communityBusiness, query) {
    const activities = await VisitActivities.fromCommunityBusiness(client, communityBusiness);
    const logsNested = await Promise.all(activities.map((act) => VisitLogs.fromActivity(client, act, query)))
    return flatten(logsNested);
  },

  async fromActivity(client, activity, query) {
    return VisitLogs.get(client, Object.assign({}, query, { where: { activityId: activity.id } }));
  },

  async aggregateByAge(client, communityBusiness, ageGroups) {
    const visitors = await Promise.all(ageGroups
      .map((ageGroup) =>
        Visitors.fromCommunityBusiness(client, communityBusiness, { whereBetween: { birthYear: ageGroup } })))

    const ageGroupToVisitors = visitors
      .map((visitorGroup, i) => ({ ageGroup: ageGroups[i], aggregate: visitorGroup }))
      .map(async ({ ageGroup, aggregate: visitors }) => {
        const q = await Promise.all(
          visitors.map((visitor) => VisitLogs.get(client, { where: { userId: visitor.id } }))
        );

        return {
          ageGroup: ageGroup,
          aggregate: flatten(q).length,
        }
      });

    return Promise.all(ageGroupToVisitors);
  },

  async aggregateByGender(client, communityBusiness) {
    const genders = Object.values(GenderEnum);
    const visitorsByGender = await Promise.all(
      genders.map((gender) => Visitors.fromCommunityBusiness(client, communityBusiness, { where: { gender } }))
    );

    return Promise.all(visitorsByGender.map(async (visitorsInGender, i) => {
      const xs = await Promise.all(visitorsInGender.map((visitor) => VisitLogs.get(client, { where: { userId: visitor.id } })))
      return {
        gender: genders[i],
        aggregate: flatten(xs).length
      };
    }));
  },

  async aggregateByActivity(client, communityBusiness) {
    const activities = await VisitActivities.fromCommunityBusiness(client, communityBusiness);
    const logss = await Promise.all(activities.map((activity) => VisitLogs.fromActivity(client, activity)));
    return logss.map((logs, i) => ({
      activity: activities[i].name,
      aggregate: logs.length,
    }));
  },

  async aggregateByTime(client, communityBusiness, since = new Date(0), until = new Date) {
    const logs = await VisitLogs.fromCommunityBusiness(client, communityBusiness, { whereBetween: { createdAt: [since, until] } })

    const grouped = Objects.mapValues(
      (logs) => logs.length,
      Arrays.collectBy((log) => moment(log.createdAt).format('YYYY-MM-DD'), logs)
    );

    return toPairs(grouped).map(([k, v]) => ({ date: k, aggregate: v }))
  }
}
