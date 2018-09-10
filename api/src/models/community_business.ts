/*
 * Community Business Model
 */
import * as Knex from 'knex';
import { compose, omit, evolve, filter, pick, invertObj } from 'ramda';
import { Dictionary, Map, Int, Day, Maybe } from '../types/internal';
import {
  CommunityBusiness,
  CommunityBusinessCollection,
  CommunityBusinessRow,
  CommunityBusinessChangeSet,
  LinkedFeedback,
  ModelQuery,
  DateTimeQuery,
  VisitActivity,
  VisitEvent,
  User,
} from './types';
import { Organisations } from './organisation';
import { applyQueryModifiers } from './util';
import { renameKeys } from '../utils';


/*
 * Custom methods
 */
type CustomMethods = {
  addFeedback: (k: Knex, c: CommunityBusiness, score: Int) => Promise<LinkedFeedback>
  getFeedback: (
    k: Knex,
    c: CommunityBusiness,
    bw?: DateTimeQuery & Pick<ModelQuery<LinkedFeedback>, 'limit' | 'offset' | 'order'>
  ) =>
    Promise<LinkedFeedback[]>
  getVisitActivities: (k: Knex, c: CommunityBusiness, d?: Day) => Promise<VisitActivity[]>
  getVisitActivityById: (k: Knex, c: CommunityBusiness, id: Int) => Promise<Maybe<VisitActivity>>
  addVisitActivity: (k: Knex, v: Partial<VisitActivity>, c: Partial<CommunityBusiness>)
    => Promise<Maybe<VisitActivity>>
  updateVisitActivity: (k: Knex, a: Partial<VisitActivity>) => Promise<Maybe<VisitActivity>>
  deleteVisitActivity: (k: Knex, i: Int) => Promise<Maybe<VisitActivity>>
  addVisitLog: (k: Knex, v: VisitActivity, u: User) => Promise<VisitEvent>
};

/*
 * Field name mappings
 *
 * ColumnToModel - DB column names                    -> keys of the CommunityBusiness type
 * ModelToColumn - keys of the CommunityBusiness type -> DB column names
 */
const ColumnToModel: Map<keyof CommunityBusinessRow, keyof CommunityBusiness> = {
  'community_business.organisation_id': 'id',
  'organisation.organisation_name': 'name',
  'organisation._360_giving_id': '_360GivingId',
  'community_business_region.region_name': 'region',
  'community_business_sector.sector_name': 'sector',
  logo_url: 'logoUrl',
  address_1: 'address1',
  address_2: 'address2',
  town_city: 'townCity',
  post_code: 'postCode',
  coordinates: 'coordinates',
  turnover_band: 'turnoverBand',
  'community_business.created_at': 'createdAt',
  'community_business.modified_at': 'modifiedAt',
  'community_business.deleted_at': 'deletedAt',
};
const ModelToColumn = invertObj(ColumnToModel);


/*
 * Helpers
 */
const transformForeignKeysToSubQueries = (client: Knex | Knex.QueryBuilder) => evolve({
  community_business_region_id: (v: string) =>
    client
      .table('community_business_region')
      .select('community_business_region_id')
      .where({ region_name: v }),
  community_business_sector_id: (v: string) =>
    client
      .table('community_business_sector')
      .select('community_business_sector_id')
      .where({ sector_name: v }),
});

const dropUnwhereableCbFields = omit([
  'createdAt',
  'modifiedAt',
  'deletedAt',
]);

const pickOrgFields = pick(['name', '_360GivingId']);
const pickCbFields = omit(['name', '_360GivingId']);

const preProcessOrgChangeset = compose(
  Organisations.toColumnNames,
  pickOrgFields
);

const preProcessCb = (qb: Knex | Knex.QueryBuilder) => compose(
  transformForeignKeysToSubQueries(qb),
  CommunityBusinesses.toColumnNames,
  dropUnwhereableCbFields,
  pickCbFields
);

/*
 * Implementation of the CommunityBusinessCollection type
 */
export const CommunityBusinesses: CommunityBusinessCollection & CustomMethods = {
  create (a: Partial<CommunityBusiness>): CommunityBusiness {
    return {
      id: a.id,
      name: a.name,
      _360GivingId: a._360GivingId,
      createdAt: a.createdAt,
      modifiedAt: a.modifiedAt,
      deletedAt: a.deletedAt,
      region: a.region,
      sector: a.sector,
      logoUrl: a.logoUrl,
      address1: a.address1,
      address2: a.address2,
      townCity: a.townCity,
      postCode: a.postCode,
      coordinates: a.coordinates,
      turnoverBand: a.turnoverBand,
    };
  },

  toColumnNames (a: Partial<CommunityBusiness>): Dictionary < any > {
    return filter((a) => typeof a !== 'undefined', {
      'community_business.organisation_id': a.id,
      'organisation.organisation_name': a.name,
      'organisation._360_giving_id': a._360GivingId,
      'community_business.created_at': a.createdAt,
      'community_business.modified_at': a.modifiedAt,
      'community_business.deleted_at': a.deletedAt,
      community_business_region_id: a.region,
      community_business_sector_id: a.sector,
      logo_url: a.logoUrl,
      address_1: a.address1,
      address_2: a.address2,
      town_city: a.townCity,
      post_code: a.postCode,
      coordinates: a.coordinates,
      turnover_band: a.turnoverBand,
    });
  },

  async get (client: Knex, q: ModelQuery < CommunityBusiness > = {}) {
    const query = evolve({
      where: CommunityBusinesses.toColumnNames,
      whereNot: CommunityBusinesses.toColumnNames,
    }, q);

    return applyQueryModifiers(
      client
        .select(query.fields ? pick(query.fields, ModelToColumn) : ModelToColumn)
        .from('community_business')
        .innerJoin(
          'community_business_region',
          'community_business_region.community_business_region_id',
          'community_business.community_business_region_id')
        .innerJoin(
          'community_business_sector',
          'community_business_sector.community_business_sector_id',
          'community_business.community_business_sector_id')
        .innerJoin(
          'organisation',
          'organisation.organisation_id',
          'community_business.organisation_id'),
      query
    );
  },

  async getOne (client: Knex, q: ModelQuery<CommunityBusiness>) {
    const [res] = await CommunityBusinesses.get(client, { ...q, limit: 1 });
    return res || null;
  },

  async exists (client: Knex, q: ModelQuery<CommunityBusiness>) {
    const res = await CommunityBusinesses.getOne(client, q);
    return res !== null;
  },

  async add (client: Knex, o: CommunityBusinessChangeSet) {
    const preProcessCbChangeset = compose(
      CommunityBusinesses.toColumnNames,
      pickCbFields
    );

    const orgChangeset = preProcessOrgChangeset(o);
    const cbChangeset = preProcessCbChangeset(o);

    const [id] = await client
      .with('new_organisation', (qb) =>
        qb
          .table('organisation')
          .insert(orgChangeset)
          .returning('*')
      )
      .insert({
        ...cbChangeset,
        organisation_id: client('new_organisation')
          .select('organisation_id'),
        community_business_region_id: client('community_business_region')
          .select('community_business_region_id')
          .where({ region_name: cbChangeset.community_business_region_id }),
        community_business_sector_id: client('community_business_sector')
          .select('community_business_sector_id')
          .where({ sector_name: cbChangeset.community_business_sector_id }),
      })
      .into('community_business')
      .returning('organisation_id');

    return CommunityBusinesses.getOne(client, { where: { id } });
  },

  async update (client: Knex, o: CommunityBusiness, c: CommunityBusinessChangeSet) {
    const preProcessCbChangeset = compose(
      CommunityBusinesses.toColumnNames,
      pickCbFields
    );

    const orgChangeset = preProcessOrgChangeset(c);
    const cbChangeset = preProcessCbChangeset(c);

    const [{ organisation_id: id }] = await client.transaction(async (trx) => {
      const cbQuery = preProcessCb(trx)(o);

      if (Object.keys(orgChangeset).length > 0) {
        await trx('organisation')
          .update(orgChangeset)
          .where({
            organisation_id: trx('community_business').select('organisation_id').where(cbQuery),
          });
      }

      if (Object.keys(cbChangeset).length > 0) {
        return trx('community_business')
          .update(cbChangeset)
          .where(cbQuery)
          .returning('*');
      }

      return trx('community_business').select('organisation_id').where(cbQuery).limit(1);
    });

    return CommunityBusinesses.getOne(client, { where: { id } });
  },

  async destroy (client: Knex, o: CommunityBusiness) {
    return client('community_business')
      .update({ deleted_at: new Date() })
      .where(preProcessCb(client)(o));
  },

  async serialise (org: CommunityBusiness) {
    return org;
  },

  async addFeedback (client: Knex, c: CommunityBusiness, score: number) {
    const [res] = await client('visit_feedback')
      .insert({ score, organisation_id: c.id })
      .returning([
        'score',
        'organisation_id AS organisationId',
        'visit_feedback_id AS id',
        'created_at AS createdAt',
        'modified_at AS modifiedAt',
        'deleted_at AS deletedAt',
      ]);

    return res;
  },

  async getFeedback (client: Knex, c: CommunityBusiness, bw?) {
    const baseQuery = applyQueryModifiers(
      client('visit_feedback')
        .select({
          id: 'visit_feedback_id',
          organisationId: 'organisation_id',
          score: 'score',
          createdAt: 'created_at',
          modifiedAt: 'modified_at',
          deletedAt: 'deleted_at',
        })
        .where({ organisation_id: c.id, deleted_at: null }),
      bw || {}
    );

    const query = bw
        ? baseQuery.whereBetween('created_at', [bw.since, bw.until])
        : baseQuery;

    return query;
  },

  async getVisitActivities (client: Knex, o: CommunityBusiness, d?: Day) {
    const baseQuery = client('visit_activity')
      .innerJoin(
        'visit_activity_category',
        'visit_activity_category.visit_activity_category_id',
        'visit_activity.visit_activity_category_id')
      .select({
        id: 'visit_activity_id',
        name: 'visit_activity_name',
        category: 'visit_activity_category.visit_activity_category_name',
        monday: 'monday',
        tuesday: 'tuesday',
        wednesday: 'wednesday',
        thursday: 'thursday',
        friday: 'friday',
        saturday: 'saturday',
        sunday: 'sunday',
        createdAt: 'created_at',
        modifiedAt: 'modified_at',
      })
      .where({ organisation_id: o.id, deleted_at: null });

    const query = d
      ? baseQuery.where({ [d]: true })
      : baseQuery;

    return query;
  },

  async getVisitActivityById (client: Knex, c: CommunityBusiness, id: number) {
    const [visitActivity] = await client('visit_activity')
        .innerJoin(
          'visit_activity_category',
          'visit_activity_category.visit_activity_category_id',
          'visit_activity.visit_activity_category_id')
        .select({
          id: 'visit_activity_id',
          name: 'visit_activity_name',
          category: 'visit_activity_category.visit_activity_category_name',
          monday: 'monday',
          tuesday: 'tuesday',
          wednesday: 'wednesday',
          thursday: 'thursday',
          friday: 'friday',
          saturday: 'saturday',
          sunday: 'sunday',
          createdAt: 'created_at',
          modifiedAt: 'modified_at',
        })
        .where({
          visit_activity_id: id,
          deleted_at: null,
          organisation_id: c.id,
        });

    return visitActivity || null;
  },

  async addVisitActivity (client: Knex, v: Partial<VisitActivity>, c: Partial<CommunityBusiness>) {
    const [res] = await client('visit_activity')
      .insert({
        visit_activity_name: v.name,
        visit_activity_category_id: client('visit_activity_category')
          .select('visit_activity_category_id')
          .where({ visit_activity_category_name: v.category }),
        organisation_id: c.id,
      })
      .returning([
        'visit_activity_id AS id',
        'visit_activity_name AS name',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
        'created_at AS createdAt',
        'modified_at as modifiedAt',
      ]);
    return res;
  },

  async updateVisitActivity (client: Knex, v: Partial<VisitActivity>) {
    const transformToColumns = compose(
      evolve({
        visit_activity_category_id: (n) =>
          client('visit_activity_category')
            .select('visit_activity_category_id')
            .where({ visit_activity_category_name: n }),
      }),
      renameKeys({
        name: 'visit_activity_name',
        category: 'visit_activity_category_id',
        createdAt: 'created_at',
        modifiedAt: 'modified_at',
      }),
      omit(['id'])
    );

    const [res] = await client('visit_activity')
      .update(transformToColumns(v))
      .where({ visit_activity_id: v.id, deleted_at: null })
      .returning([
        'visit_activity_id AS id',
        'visit_activity_name AS name',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
        'created_at AS createdAt',
        'modified_at AS modifiedAt',
      ]);

    return res ? { ...res, category: v.category } : null;
  },

  async deleteVisitActivity (client: Knex, id: Int) {
    const [res] = await client('visit_activity')
      .where({ visit_activity_id: id, deleted_at: null })
      .update({ deleted_at: new Date() })
      .returning([
        'visit_activity_id AS id',
        'visit_activity_name AS name',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday',
        'created_at AS createdAt',
        'modified_at AS modifiedAt',
        'deleted_at AS deletedAt',
      ]);

    return res || null;
  },

  async addVisitLog (client: Knex, v: VisitActivity, u: User) {
    const [res] = await client('visit')
      .insert({
        user_account_id: u.id,
        visit_activity_id: v.id,
      })
      .returning([
        'visit_id AS id',
        'user_account_id AS userId',
        'visit_activity_id AS visitActivityId',
        'created_at AS createdAt',
        'modified_at AS modifiedAt',
        'deleted_at AS deletedAt',
      ]);
    return <VisitEvent> res;
  },
};

