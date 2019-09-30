import { VisitActivityCollection, VisitActivity, WhereBetweenQuery, WhereQuery } from '../types/index';
import { Objects } from 'twine-util';
import { isWhereBetween } from '../util';

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
  id: 'visit_activity.visit_activity_id' as keyof UserModelRecord,
  name: 'visit_activity.visit_activity_name' as keyof UserModelRecord,
  monday: 'visit_activity.monday',
  tuesday: 'visit_activity.tuesday',
  wednesday: 'visit_activity.wednesday',
  thursday: 'visit_activity.thursday',
  friday: 'visit_activity.friday',
  saturday: 'visit_activity.saturday',
  sunday: 'visit_activity.sunday',
  createdAt: 'visit_activity.created_at' as keyof UserModelRecord,
  modifiedAt: 'visit_activity.modified_at' as keyof UserModelRecord,
  deletedAt: 'visit_activity.deleted_at' as keyof UserModelRecord,
  category: '',
  organisation: '',
}

export const VisitActivities: VisitActivityCollection = {
  _toColumnNames(a: WhereQuery<VisitActivity> | WhereBetweenQuery<VisitActivity>): any {
    if (isWhereBetween(a)) {
      return Objects.renameKeys(modelToRecordMap)(a) as WhereBetweenQuery<UserModelRecord>;
    } else {
      return Objects.renameKeys(modelToRecordMap)(a) as WhereQuery<UserModelRecord>;
    }
  },
}
