/*
 * Organisation Model
 */
import * as Knex from 'knex';
import { compose, omit, evolve, filter, pick, invertObj } from 'ramda';
import { Map } from '../types/internal';
import { Organisation, OrganisationCollection, OrganisationRow, } from './types';
import { applyQueryModifiers } from './applyQueryModifiers';
import { Users } from './user';


/*
 * Field name mappings
 *
 * ColumnToModel - DB column names       -> keys of the User type
 * ModelToColumn - keys of the User type -> DB column names
 */
const ColumnToModel: Map<keyof OrganisationRow, keyof Organisation> = {
  'organisation.organisation_id': 'id',
  'organisation.organisation_name': 'name',
  'organisation._360_giving_id': '_360GivingId',
  'organisation.created_at': 'createdAt',
  'organisation.modified_at': 'modifiedAt',
  'organisation.deleted_at': 'deletedAt',
  'organisation.is_temp': 'isTemp',
};
const ModelToColumn = invertObj(ColumnToModel);


/*
 * Helpers
 */
export const dropUnWhereableOrgFields = omit([
  'createdAt',
  'modifiedAt',
  'deletedAt',
]);


/*
 * Implementation of the OrganisationCollection type
 */
export const Organisations: OrganisationCollection = {
  create (a) {
    return {
      id: a.id,
      name: a.name,
      _360GivingId: a._360GivingId,
      createdAt: a.createdAt,
      modifiedAt: a.modifiedAt,
      deletedAt: a.deletedAt,
      isTemp: a.isTemp,
    };
  },

  toColumnNames (a) {
    return filter((a) => typeof a !== 'undefined', {
      organisation_id: a.id,
      organisation_name: a.name,
      _360_giving_id: a._360GivingId,
      created_at: a.createdAt,
      modified_at: a.modifiedAt,
      deleted_at: a.deletedAt,
      is_temp: a.isTemp,
    });
  },

  async get (client, q = {}) {
    const query = evolve({
      where: Organisations.toColumnNames,
      whereNot: Organisations.toColumnNames,
    }, q);

    return applyQueryModifiers(
      client
        .select(query.fields ? pick(query.fields, ModelToColumn) : ModelToColumn)
        .from('organisation'),
      query
    );
  },

  async getOne (client, query) {
    const [res] = await Organisations.get(client, { ...query, limit: 1 });
    return res || null;
  },

  async fromUser (client, q) {
    const query = evolve({
      where: compose(Users.toColumnNames, omit(['createdAt'])),
      whereNot: Users.toColumnNames,
    }, q);

    const [user] = await applyQueryModifiers(
      client('organisation')
        .innerJoin(
          'user_account_access_role',
          'user_account_access_role.organisation_id',
          'organisation.organisation_id')
        .innerJoin(
          'user_account',
          'user_account_access_role.user_account_id',
          'user_account.user_account_id')
        .innerJoin(
          'gender',
          'gender.gender_id',
          'user_account.gender_id')
        .innerJoin(
          'disability',
          'disability.disability_id',
          'user_account.disability_id')
        .innerJoin(
          'ethnicity',
          'ethnicity.ethnicity_id',
          'user_account.ethnicity_id')
        .select(ModelToColumn),
      query);

    return user || null;
  },

  async exists (client, query) {
    const res = await Organisations.getOne(client, query);
    return res !== null;
  },

  async add (client: Knex, organisation) {
    const [id] = await client('organisation')
      .insert(Organisations.toColumnNames(organisation))
      .returning('organisation_id');

    return Organisations.getOne(client, { where: { id } });
  },

  async update (client, organisation, changes) {
    const preProcessOrg = compose(
      Organisations.toColumnNames,
      dropUnWhereableOrgFields
    );

    const [id] = await client('organisation')
      .update(Organisations.toColumnNames(changes))
      .where(preProcessOrg(organisation))
      .returning('organisation_id');

    return Organisations.getOne(client, { where: { id } });
  },

  async destroy (client, organisation) {
    const preProcessOrg = compose(
      Organisations.toColumnNames,
      dropUnWhereableOrgFields
    );

    return client('organisation')
      .update({ deleted_at: new Date() })
      .where(preProcessOrg(organisation));
  },

  async serialise (org: Organisation) {
    return org;
  },
};
