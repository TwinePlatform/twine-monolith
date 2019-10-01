import * as Knex from 'knex';
import { Objects } from 'twine-util';
import { isWhereBetween } from '../util';
import { VisitActivityRecord } from '../types/collection';
import {
  VisitActivityCollection,
  VisitActivity,
  WhereBetweenQuery,
  WhereQuery,
  ModelQuery,
  ModelQueryPartial
} from '../types/index';
import { applyQueryModifiers } from '../query_util';

// interface Collection<TModel extends Model, TRecord> {
//   _toColumnNames (a: WhereQuery<TModel>): WhereQuery<TRecord>;
//   _toColumnNames (a: WhereBetweenQuery<TModel>): WhereBetweenQuery<TRecord>;

//   cast (a: Dictionary<ValueOf<TModel>>, tag?: TModel['__tag']): Partial<TModel>;

//   serialise (a: Partial<TModel>): Promise<EnhancedJson>;

//   exists (k: Knex, a: Partial<TModel>): Promise<boolean>;

//   get (k: Knex, q?: ModelQuery<TModel>): Promise<TModel[]>;
//   get (k: Knex, q?: ModelQueryPartial<TModel>): Promise<Partial<TModel>[]>;

//   getOne (k: Knex, q?: ModelQuery<TModel>): Promise<Maybe<TModel>>;
//   getOne (k: Knex, q?: ModelQueryPartial<TModel>): Promise<Maybe<Partial<TModel>>>;

//   create (k: Knex, c: Partial<TModel>): Promise<TModel>;

//   update (k: Knex, t: SimpleModelQuery<TModel>, c: Partial<TModel>): Promise<TModel[]>;

//   delete (k: Knex, t: SimpleModelQuery<TModel>): Promise<TModel[]>;

//   destroy (k: Knex, t: SimpleModelQuery<TModel>): Promise<TModel[]>;
// }

export const modelToRecordMap = {
  id: 'visit_activity.visit_activity_id' as keyof VisitActivityRecord,
  name: 'visit_activity.visit_activity_name' as keyof VisitActivityRecord,
  monday: 'visit_activity.monday' as keyof VisitActivityRecord,
  tuesday: 'visit_activity.tuesday' as keyof VisitActivityRecord,
  wednesday: 'visit_activity.wednesday' as keyof VisitActivityRecord,
  thursday: 'visit_activity.thursday' as keyof VisitActivityRecord,
  friday: 'visit_activity.friday' as keyof VisitActivityRecord,
  saturday: 'visit_activity.saturday' as keyof VisitActivityRecord,
  sunday: 'visit_activity.sunday' as keyof VisitActivityRecord,
  createdAt: 'visit_activity.created_at' as keyof VisitActivityRecord,
  modifiedAt: 'visit_activity.modified_at' as keyof VisitActivityRecord,
  deletedAt: 'visit_activity.deleted_at' as keyof VisitActivityRecord,
}

export const VisitActivities: VisitActivityCollection = {
  _toColumnNames(a: WhereQuery<VisitActivity> | WhereBetweenQuery<VisitActivity>): any {
    if (isWhereBetween(a)) {
      return Objects.renameKeys(modelToRecordMap)(a) as WhereBetweenQuery<VisitActivityRecord>;
    } else {
      return Objects.renameKeys(modelToRecordMap)(a) as WhereQuery<VisitActivityRecord>;
    }
  },

  async get (client: Knex, query: ModelQuery<VisitActivity> | ModelQueryPartial<VisitActivity>) {
    const _q = {
      where: VisitActivities._toColumnNames(query.where),
      whereNot: VisitActivities._toColumnNames(query.whereNot),
      whereBetween: VisitActivities._toColumnNames(query.whereBetween),
      whereNotBetween: VisitActivities._toColumnNames(query.whereNotBetween),
      limit: query.limit,
      offset: query.offset,
    };

    const x = applyQueryModifiers<VisitActivityRecord, VisitActivity[], VisitActivityRecord>(
      client<VisitActivityRecord, VisitActivity[]>('visit_activity')
        .leftOuterJoin(
          'visit_activity_category',
          'visit_activity_category.visit_activity_category_id',
          'visit_activity.visit_activity_category_id'),
      _q
    );

    if ('fields' in query) {
      return x.select(pick(query.fields, modelToRecordMap)) as Knex.QueryBuilder<UserModelRecord, Partial<Visitor>[]>;
    } else {
      return x.select(modelToRecordMap) as Knex.QueryBuilder<UserModelRecord, Visitor[]>;
    }
  }
}
