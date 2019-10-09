import * as Knex from 'knex';
import { pick } from 'ramda';
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

const returnAs = [
  'visit_activity.visit_activity_id AS id',
  'visit_activity.visit_activity_name AS name',
  'visit_activity.visit_activity_category_id AS categoryId',
  'visit_activity.organisation_id AS organisationId',
  'visit_activity.monday AS monday',
  'visit_activity.tuesday AS tuesday',
  'visit_activity.wednesday AS wednesday',
  'visit_activity.thursday AS thursday',
  'visit_activity.friday AS friday',
  'visit_activity.saturday AS saturday',
  'visit_activity.sunday AS sunday',
  'visit_activity.created_at AS createdAt',
  'visit_activity.modified_at AS modifiedAt',
  'visit_activity.deleted_at AS deletedAt',
]


export const VisitActivities: VisitActivityCollection = {
  _toColumnNames(a: WhereQuery<VisitActivity> | WhereBetweenQuery<VisitActivity>): any {
    if (isWhereBetween(a)) {
      return Objects.renameKeys(modelToRecordMap)(a) as WhereBetweenQuery<VisitActivityRecord>;
    } else {
      return Objects.renameKeys(modelToRecordMap)(a) as WhereQuery<VisitActivityRecord>;
    }
  },

  cast(a) {
    return {
      __model: true,
      __tag: 'VisitActivity',
      id: a.id,
      name: a.name,
      categoryId: a.categoryId,
      organisationId: a.organisationId,
      monday: a.monday,
      tuesday: a.tuesday,
      wednesday: a.wednesday,
      thursday: a.thursday,
      friday: a.friday,
      saturday: a.saturday,
      sunday: a.sunday,
      createdAt: a.createdAt,
      modifiedAt: a.modifiedAt,
      deletedAt: a.deletedAt,
    } as Partial<VisitActivity>;
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
      return x.select(pick(query.fields, modelToRecordMap)) as Knex.QueryBuilder<VisitActivityRecord, Partial<VisitActivity>[]>;
    } else {
      return x.select(modelToRecordMap) as Knex.QueryBuilder<VisitActivityRecord, VisitActivity[]>;
    }
  },

  async getOne (client: Knex, query: ModelQuery<VisitActivity> | ModelQueryPartial<VisitActivity>) {
    const [activity] = await VisitActivities.get(client, Object.assign(query, { limit: 1 }));
    return activity || null;
  },

  async exists (client, query) {
    return null !== VisitActivities.getOne(client, { where: query });
  },

  async create (client, activity) {
    return client<VisitActivityRecord, VisitActivity>('visit_activity')
      .insert(
        {
          'visit_activity.visit_activity_name': activity.name,
          'visit_activity.visit_activity_category_id': activity.categoryId,
          'visit_activity.organisation_id': activity.organisationId,
          'visit_activity.monday': activity.monday,
          'visit_activity.tuesday': activity.tuesday,
          'visit_activity.wednesday': activity.wednesday,
          'visit_activity.thursday': activity.thursday,
          'visit_activity.friday': activity.friday,
          'visit_activity.saturday': activity.saturday,
          'visit_activity.sunday': activity.sunday,
        },
        returnAs
      );
  },

  async update (client, target, changeset) {
    return applyQueryModifiers(
      client<VisitActivityRecord, VisitActivity>('visit_activity')
        .update(
          {
            'visit_activity.visit_activity_name': changeset.name,
            'visit_activity.visit_activity_category_id': changeset.categoryId,
            'visit_activity.organisation_id': changeset.organisationId,
            'visit_activity.monday': changeset.monday,
            'visit_activity.tuesday': changeset.tuesday,
            'visit_activity.wednesday': changeset.wednesday,
            'visit_activity.thursday': changeset.thursday,
            'visit_activity.friday': changeset.friday,
            'visit_activity.saturday': changeset.saturday,
            'visit_activity.sunday': changeset.sunday,
          },
          returnAs
        ),
      target
    );
  },

  async delete (client, target) {
    return applyQueryModifiers(
      client<VisitActivityRecord, VisitActivity>('visit_activity')
        .update({ 'visit_activity.deleted_at': new Date() }, returnAs),
      target
    );
  },

  async destroy (client, target) {
    return applyQueryModifiers(
      client<VisitActivityRecord, VisitActivity>('visit_activity')
        .delete()
        .returning(returnAs),
      target
    );
  },

  async add (client, communityBusiness, category, name, days) {
    return VisitActivities.create(
      client,
      Object.assign({
        name,
        categoryId: category.id,
        organisationId: communityBusiness.id
      }, days)
    );
  },

  async fromCommunityBusiness(client, communityBusiness) {
    return VisitActivities.get(client, { where: { organisationId: communityBusiness.id } });
  },

  async fromCategory(client, category) {
    return VisitActivities.get(client, { where: { categoryId: category.id } });
  },
}
