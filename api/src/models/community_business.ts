/*
 * Community Business Model
 */
import * as Knex from 'knex';
import * as moment from 'moment';
import {
  compose,
  omit,
  evolve,
  filter,
  pick,
  invertObj,
  pipe,
  assocPath,
  difference,
  identity,
} from 'ramda';
import { randomBytes } from 'crypto';
import { Objects } from 'twine-util';
import { Dictionary } from '../types/internal';
import {
  CommunityBusiness,
  CommunityBusinessCollection,
  CommunityBusinessRow,
  VisitEvent,
  RegionEnum,
  SectorEnum,
  VisitActivity,
} from './types';
import { Organisations } from './organisation';
import { AgeList } from './age';
import { applyQueryModifiers } from './applyQueryModifiers';

const renameKeysToColumns = Objects.renameKeys({
  name: 'visit_activity_name',
  category: 'visit_activity_category_id',
  createdAt: 'created_at',
  modifiedAt: 'modified_at',
});


/*
 * Field name mappings
 *
 * ColumnToModel - DB column names                    -> keys of the CommunityBusiness type
 * ModelToColumn - keys of the CommunityBusiness type -> DB column names
 */
const ColumnToModel: Record<keyof CommunityBusinessRow, keyof CommunityBusiness> = {
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
  'organisation.is_temp': 'isTemp',
};

const ModelToColumn = invertObj(ColumnToModel);

const optionalFields: Dictionary<string> = {
  adminCode: 'volunteer_admin_code.code',
};

/*
 * Helpers
 */
const transformForeignKeysToSubQueries = (client: Knex | Knex.QueryBuilder) => evolve({
  'community_business.community_business_region_id': (v: string) =>
    client
      .table('community_business_region')
      .select('community_business_region_id')
      .where({ region_name: v, deleted_at: null }),
  'community_business.community_business_sector_id': (v: string) =>
    client
      .table('community_business_sector')
      .select('community_business_sector_id')
      .where({ sector_name: v, deleted_at: null }),
});

const dropUnwhereableCbFields = omit([
  'createdAt',
  'modifiedAt',
  'deletedAt',
]);

const pickOrgFields = pick(['name', '_360GivingId', 'isTemp']);
const pickCbFields = omit(['name', '_360GivingId', 'isTemp']);

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
export const CommunityBusinesses: CommunityBusinessCollection = {
  create(a) {
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
      isTemp: a.isTemp,
    };
  },

  toColumnNames(a) {
    return filter((a) => typeof a !== 'undefined', {
      'community_business.organisation_id': a.id,
      'organisation.organisation_name': a.name,
      'organisation._360_giving_id': a._360GivingId,
      'community_business.created_at': a.createdAt,
      'community_business.modified_at': a.modifiedAt,
      'community_business.deleted_at': a.deletedAt,
      'community_business.community_business_region_id': a.region,
      'community_business.community_business_sector_id': a.sector,
      logo_url: a.logoUrl,
      address_1: a.address1,
      address_2: a.address2,
      town_city: a.townCity,
      post_code: a.postCode,
      coordinates: a.coordinates,
      turnover_band: a.turnoverBand,
    });
  },

  async get(client, q = {}) {
    const query: any = evolve({
      where: pipe(CommunityBusinesses.toColumnNames, transformForeignKeysToSubQueries(client)),
      whereNot: CommunityBusinesses.toColumnNames,
    }, q);

    return applyQueryModifiers(
      client
        .select(query.fields
          ? pick(query.fields, { ...ModelToColumn, ...optionalFields })
          : ModelToColumn)
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
          'community_business.organisation_id')
        // joins for optional fields
        .leftOuterJoin(
          'volunteer_admin_code',
          'organisation.organisation_id',
          'volunteer_admin_code.organisation_id'),
      query
    );
  },

  async getOne(client, query) {
    const [res] = await CommunityBusinesses.get(client, { ...query, limit: 1 });
    return res || null;
  },

  async getTemporary(client) {
    return client('organisation')
      .select({
        id: 'organisation.organisation_id',
        name: 'organisation.organisation_name',
        createdAt: 'organisation.created_at',
        modifiedAt: 'organisation.modified_at',
        deletedAt: 'organisation.deleted_at',
      })
      .where({ is_temp: true });
  },

  async exists(client, query) {
    const res = await CommunityBusinesses.getOne(client, query);
    return res !== null;
  },

  async add(client, cb, code) {
    const preProcessCbChangeset = compose(
      Objects.mapKeys((s) => s.replace('community_business.', '')),
      transformForeignKeysToSubQueries(client),
      CommunityBusinesses.toColumnNames,
      pickCbFields
    );

    const orgChangeset = preProcessOrgChangeset(cb);
    const cbChangeset = preProcessCbChangeset(cb);

    const [id] = await client.transaction(async (trx) => {
      const [newOrg] = await trx
        .table('organisation')
        .insert(orgChangeset)
        .returning('*');

      await trx
        .insert({ code, organisation_id: newOrg.organisation_id, })
        .into('volunteer_admin_code')
        .returning('*');

      return trx
        .insert({
          ...cbChangeset,
          organisation_id: newOrg.organisation_id,
        })
        .into('community_business')
        .returning('organisation_id');
    });

    return CommunityBusinesses.getOne(client, { where: { id } });
  },

  async addTemporary(client, name) {
    return CommunityBusinesses.add(client, {
      name,
      region: RegionEnum.TEMPORARY_DATA,
      sector: SectorEnum.TEMPORARY_DATA,
      isTemp: true,
    });
  },

  async update(client, cb, changes) {
    const orgChangeset = preProcessOrgChangeset(changes);

    const [{ organisation_id: id }] = await client.transaction(async (trx) => {
      const cbQuery = preProcessCb(trx)(cb);
      const preProcessCbChangeset = compose(
        Objects.mapKeys((s) => s.replace('community_business.', '')),
        transformForeignKeysToSubQueries(trx),
        CommunityBusinesses.toColumnNames,
        pickCbFields
      );
      const cbChangeset = preProcessCbChangeset(changes);

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

  async destroy(client, cb) {
    return client('community_business')
      .update({ deleted_at: new Date() })
      .where(preProcessCb(client)(cb));
  },

  async addFeedback(client, cb, score) {
    const [res] = await client('visit_feedback')
      .insert({ score, organisation_id: cb.id })
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

  async getFeedback(client, cb, bw?) {
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
        .where({ organisation_id: cb.id, deleted_at: null }),
      bw || {}
    );

    const query = bw
      ? baseQuery.whereBetween('created_at', [bw.since, bw.until])
      : baseQuery;

    return query;
  },

  async addVolunteerActivity(client, activity) {
    const res = await client('volunteer_activity')
      .insert({ volunteer_activity_name: activity });

    return res;
  },

  async activityExists(client, activity) {
    const res = await client('volunteer_activity')
      .where('volunteer_activity_name', activity);
    return res.length >= 1;
  },

  async addVolunteerProject(client, project, orgId) {
    const res = await client('volunteer_project')
      .insert({ volunteer_project_name: project, organisation_id: orgId });

    return res;
  },

  async projectExists(client, project, orgId) {
    const res = await client('volunteer_project')
      .where({
        volunteer_project_name: project,
        organisation_id: orgId
      });
    return res.length >= 1;
  },

  async getVisitActivities(client, cb, day?) {
    const baseQuery = client('visit_activity')
      .leftOuterJoin(
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
        createdAt: 'visit_activity.created_at',
        modifiedAt: 'visit_activity.modified_at',
      })
      .where({ organisation_id: cb.id, 'visit_activity.deleted_at': null });

    const query = day
      ? baseQuery.where({ [day]: true })
      : baseQuery;

    return query;
  },

  async getVisitActivityById(client, cb, id) {
    const [visitActivity] = await client('visit_activity')
      .leftOuterJoin(
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
        createdAt: 'visit_activity.created_at',
        modifiedAt: 'visit_activity.modified_at',
      })
      .where({
        visit_activity_id: id,
        'visit_activity.deleted_at': null,
        organisation_id: cb.id,
      });

    return visitActivity || null;
  },

  async getVisitActivityByName(client, cb, name) {
    const [visitActivity] = await client('visit_activity')
      .leftOuterJoin(
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
        createdAt: 'visit_activity.created_at',
        modifiedAt: 'visit_activity.modified_at',
      })
      .where({
        visit_activity_name: name,
        'visit_activity.deleted_at': null,
        organisation_id: cb.id,
      });

    return visitActivity || null;
  },

  async addVisitActivity(client, visitActivity, cb) {
    const [res] = await client('visit_activity')
      .insert({
        visit_activity_name: visitActivity.name,
        visit_activity_category_id: client('visit_activity_category')
          .select('visit_activity_category_id')
          .where({ visit_activity_category_name: visitActivity.category }),
        organisation_id: cb.id,
      })
      .returning([
        'visit_activity_id AS id',
        'visit_activity_name AS name',
        'visit_activity_category_id AS category_id',
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

    const [{ category }]: { category: string }[] = await client('visit_activity_category')
      .select('visit_activity_category_name AS category')
      .where({ visit_activity_category_id: res.category_id })

    return { ...omit(['category_id'], res) as Omit<VisitActivity, 'category'>, category };
  },

  async updateVisitActivity(client, visitActivity) {
    const transformToColumns = compose(
      evolve({
        visit_activity_category_id: (n) =>
          client('visit_activity_category')
            .select('visit_activity_category_id')
            .where({ visit_activity_category_name: n }),
      }),
      (v: Omit<VisitActivity, 'id'>) => renameKeysToColumns<string | boolean>(v),
      omit(['id'])
    );

    const [res] = await client('visit_activity')
      .update(transformToColumns(visitActivity))
      .where({ visit_activity_id: visitActivity.id, deleted_at: null })
      .returning([
        'visit_activity_id AS id',
        'visit_activity_name AS name',
        'visit_activity_category_id AS cat_id',
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

    if (!res) {
      return null;
    }

    const [{ category }]: { category: string }[] = await client('visit_activity_category')
      .select('visit_activity_category_name AS category')
      .where({ visit_activity_category_id: res.cat_id });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { cat_id, ...activity } = res;
    return { ...activity, category };
  },

  async deleteVisitActivity(client, id) {
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

  async addVisitLog(client, visitActivity, user, signInType) {
    const res = await client.transaction(async (trx) => {
      const [log] = await trx('visit_log')
        .insert({
          user_account_id: user.id,
          visit_activity_id: visitActivity.id,
        })
        .returning([
          'visit_log_id AS id',
          'user_account_id AS userId',
          'visit_activity_id AS visitActivityId',
          'created_at AS createdAt',
          'modified_at AS modifiedAt',
          'deleted_at AS deletedAt',
        ]);

      await trx('visit_log_attendance')
        .insert({
          visit_log_id: log.id,
          sign_in_type: signInType,
        });

      return log;
    });

    return res as VisitEvent;

  },

  async getVisitLogsWithUsers(client, cb, q) {
    const modifyColumnNames = evolve({
      where: Objects.renameKeys({
        visitActivity: 'visit_activity.visit_activity_name',
        gender: 'gender.gender_name',
      }),
      whereBetween: pipe(
        evolve({ birthYear: AgeList.toBirthYear }),
        Objects.renameKeys({ birthYear: 'user_account.birth_year', createdAt: 'visit_log.created_at' })
      ),
    });
    const checkSpecificCb = assocPath(['where', 'visit_activity.organisation_id'], cb.id);
    const limitDates = q && q.since && q.until
      ? assocPath(['whereBetween', 'visit_log.created_at'], [q.since, q.until])
      : identity;
    const query = pipe(modifyColumnNames, limitDates, checkSpecificCb)(q);

    return applyQueryModifiers(client('visit_log')
      .select({
        id: 'visit_log_id',
        userId: 'user_account.user_account_id',
        visitActivity: 'visit_activity_name',
        category: 'visit_activity_category_name',
        createdAt: 'visit_log.created_at',
        modifiedAt: 'visit_log.modified_at',
        birthYear: 'user_account.birth_year',
        gender: 'gender.gender_name',
      })
      .innerJoin(
        'visit_activity',
        'visit_activity.visit_activity_id',
        'visit_log.visit_activity_id')
      .leftOuterJoin(
        'visit_activity_category',
        'visit_activity_category.visit_activity_category_id',
        'visit_activity.visit_activity_category_id')
      .innerJoin('user_account', 'user_account.user_account_id', 'visit_log.user_account_id')
      .innerJoin('gender', 'gender.gender_id', 'user_account.gender_id'),
      query);
  },

  async getVisitLogAggregates(client, cb, aggs, query) {
    const unsupportedAggregates = difference(aggs, ['age', 'gender', 'visitActivity', 'lastWeek']);
    if (unsupportedAggregates.length > 0) {
      throw new Error(`${unsupportedAggregates.join(', ')} are not supported aggregate fields`);
    }
    const year = moment().year();

    const modifyColumnNames = evolve({
      where: Objects.renameKeys({
        visitActivity: 'visit_activity.visit_activity_name',
        gender: 'gender.gender_name',
      }),
      whereBetween: pipe(
        evolve({ birthYear: AgeList.toBirthYear }),
        Objects.renameKeys({ birthYear: 'user_account.birth_year' })
      ),
    });

    const modifyColumnNamesForAge = evolve({
      where: Objects.renameKeys({
        visitActivity: 'visit_activity.visit_activity_name',
        gender: 'gender.gender_name',
      }),
      whereBetween: pipe(
        evolve({ birthYear: AgeList.toBirthYear }),
        Objects.renameKeys({ birthYear: 'age_group_table.birth_year' })
      ),
    });

    const checkSpecificCb = assocPath(['where', 'visit_activity.organisation_id'], cb.id);

    const queryMatchOnColumnNames = pipe(modifyColumnNames, checkSpecificCb)(query);
    const ageQuery = pipe(modifyColumnNamesForAge, checkSpecificCb)(query);

    const aggregateQueries: Dictionary<PromiseLike<any>> = {
      gender: applyQueryModifiers(client('visit_log')
        .count('gender.gender_name')
        .select({
          gender: 'gender.gender_name',
        })
        .innerJoin(
          'visit_activity',
          'visit_activity.visit_activity_id',
          'visit_log.visit_activity_id')
        .innerJoin('user_account', 'user_account.user_account_id', 'visit_log.user_account_id')
        .innerJoin('gender', 'gender.gender_id', 'user_account.gender_id')
        .groupBy('gender.gender_name')
        , queryMatchOnColumnNames)
        .then((rows) => {
          const gender: Dictionary<number> = rows
            .reduce((acc: Dictionary<number>, row: { gender: string; count: number }) => {
              acc[row.gender] = Number(row.count);
              return acc;
            }, {});
          return { gender };
        }),

      visitActivity: applyQueryModifiers(client('visit_log')
        .count('visit_activity.visit_activity_name')
        .select({
          activity: 'visit_activity_name',
        })
        .innerJoin(
          'visit_activity',
          'visit_activity.visit_activity_id',
          'visit_log.visit_activity_id')
        .innerJoin('user_account', 'user_account.user_account_id', 'visit_log.user_account_id')
        .innerJoin('gender', 'gender.gender_id', 'user_account.gender_id')
        .groupBy('visit_activity.visit_activity_name'), queryMatchOnColumnNames)
        .then((rows) => {
          const visitActivity = rows
            .reduce((acc: Dictionary<number>, row: { activity: string; count: number }) => {
              acc[row.activity] = Number(row.count);
              return acc;
            }, {});
          return { visitActivity };
        }),

      age: applyQueryModifiers(client.with('age_group_table',
        client
          .raw('SELECT *, CASE ' +
            'WHEN birth_year IS NULL THEN \'null\' ' +
            `WHEN birth_year > ${year - 17} THEN '0-17' ` +
            `WHEN birth_year > ${year - 34} AND birth_year <= ${year - 17} THEN '18-34' ` +
            `WHEN birth_year > ${year - 50} AND birth_year <= ${year - 34} THEN '35-50' ` +
            `WHEN birth_year > ${year - 69} AND birth_year <= ${year - 50} THEN '51-69' ` +
            `WHEN birth_year <= ${year - 69} THEN '70+' ` +
            'END AS age_group ' +
            'FROM visit_log ' +
            'INNER JOIN user_account ON user_account.user_account_id = visit_log.user_account_id')
      )
        // TODO: generate case statements based on supplied query
        .innerJoin(
          'visit_activity',
          'visit_activity.visit_activity_id',
          'age_group_table.visit_activity_id')
        .innerJoin('gender', 'gender.gender_id', 'age_group_table.gender_id')
        .count('age_group')
        .select({ ageGroup: 'age_group' })
        .groupBy('age_group')
        .from('age_group_table'), ageQuery)
        .then((rows) => {
          const age = rows
            .reduce((acc: Dictionary<number>, row: { ageGroup: string; count: number }) => {
              acc[row.ageGroup] = Number(row.count);
              return acc;
            }, {});
          return { age };
        }),
      lastWeek: applyQueryModifiers(client('visit_log')
        .select({ createdAt: 'visit_log.created_at' })
        .whereRaw('visit_log.created_at >= CURRENT_DATE - INTERVAL \'7 day\'')
        .innerJoin(
          'visit_activity',
          'visit_activity.visit_activity_id',
          'visit_log.visit_activity_id')
        .innerJoin('user_account', 'user_account.user_account_id', 'visit_log.user_account_id')
        .innerJoin('gender', 'gender.gender_id', 'user_account.gender_id'), queryMatchOnColumnNames)
        .orderBy('visit_log.created_at')
        .then((data: Pick<VisitEvent, 'createdAt'>[]) => {
          const lastWeek = data.reduce((acc: Dictionary<number>, visit) => {
            const visitDateKey = moment(visit.createdAt).format('DD-MM-YYYY');
            acc[visitDateKey] = acc[visitDateKey] + 1 || 1;
            return acc;
          }, {});
          return { lastWeek };
        }),
    };

    const requestedAggregates = aggs.map((agg) => aggregateQueries[agg]);
    const rawAggregateData = await Promise.all(requestedAggregates);
    return rawAggregateData.reduce((acc, el) => ({ ...acc, ...el }), {});
  },
};
