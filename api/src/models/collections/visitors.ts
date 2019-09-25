import * as Knex from 'knex';
import { pick } from 'ramda'
import { Users, modelToRecordMap } from './users';
import { VisitorCollection, RoleEnum, User, ModelQuery, ModelQueryPartial, UserModelRecord } from '../types/index';
import { applyQueryModifiers } from '../query_util';


const additionalColumnMap: Record<any, string> = {
  id: 'visit_log.visit_log_id',
  createdAt: 'visit_log.created_at',
  modifiedAt: 'visit_log.modified_at',
  deletedAt: 'visit_log.deleted_at',
  userId: 'visit_log.user_account_id',
  visitActivityId: 'visit_activity.visit_activity_id',
  visitActivity: 'visit_activity.visit_activity_name',
};


export const Visitors: VisitorCollection = {
  _toColumnNames: Users._toColumnNames,
  cast: (a) => Users.cast(a, 'Visitor'),
  serialise: Users.serialise,
  exists: Users.exists,

  getOne: Users.getOne,
  create: Users.create,
  update: Users.update,
  delete: Users.delete,
  destroy: Users.destroy,

  async get (client: Knex, query: ModelQuery<Visitor> | ModelQueryPartial<Visitor>) {
    const _q = {
      where: Users._toColumnNames(query.where),
      whereNot: Users._toColumnNames(query.whereNot),
      whereBetween: Users._toColumnNames(query.whereBetween),
      whereNotBetween: Users._toColumnNames(query.whereNotBetween),
      limit: query.limit,
      offset: query.offset,
    };

    const x = applyQueryModifiers<UserModelRecord, User[], UserModelRecord>(
      client<UserModelRecord, User[]>('user_account')
        .leftOuterJoin('gender', 'gender.gender_id', 'user_account.gender_id')
        .leftOuterJoin('disability', 'disability.disability_id', 'user_account.gender_id')
        .leftOuterJoin('ethnicity', 'ethnicity.ethnicity_id', 'user_account.ethnicity_id')
        .leftOuterJoin(
          'user_account_access_role',
          'user_account.user_account_id',
          'user_account_access_role.user_account_id')
        .where({
          ['user_account_access_role.access_role_id']: client('access_role')
            .select('access_role_id')
            .where({ access_role_name: RoleEnum.VISITOR }),
        }),
      _q
    );

    if ('fields' in query) {
      return x.select(pick(query.fields, modelToRecordMap)) as Knex.QueryBuilder<UserModelRecord, Partial<User>[]>;
    } else {
      return x.select(modelToRecordMap) as Knex.QueryBuilder<UserModelRecord, User[]>;
    }
  },

  async getWithVisits(client, communityBusiness, query, activity) {
    Visitors.get(client, query)
  },
};
