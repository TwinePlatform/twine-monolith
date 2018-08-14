/*
 * Organisation Model
 */
import * as Knex from 'knex';
import { compose, omit, evolve, filter, pick, invertObj } from 'ramda';
import { Dictionary, Map } from '../types/internal';
import {
  Organisation,
  OrganisationCollection,
  OrganisationRow,
  OrganisationChangeSet,
  ModelQuery,
  User
} from './types';
import { applyQueryModifiers } from './util';
import { Users } from './user';

/*
 * Declarations for methods specific to this model
 */
type CustomMethods = {
  fromUser: (k: Knex, q: ModelQuery<User>) => Promise<Organisation>
};


/*
 * Field name mappings
 *
 * ColumnToModel - DB column names       -> keys of the User type
 * ModelToColumn - keys of the User type -> DB column names
 */
const ColumnToModel: Map<keyof OrganisationRow, keyof Organisation> = {
  organisation_id: 'id',
  organisation_name: 'name',
  _360_giving_id: '_360GivingId',
  created_at: 'createdAt',
  modified_at: 'modifiedAt',
  deleted_at: 'deletedAt',
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
export const Organisations: OrganisationCollection & CustomMethods = {
  create (a: Partial<Organisation>): Organisation {
    return {
      id: a.id,
      name: a.name,
      _360GivingId: a._360GivingId,
      createdAt: a.createdAt,
      modifiedAt: a.modifiedAt,
      deletedAt: a.deletedAt,
    };
  },

  toColumnNames (a: Partial<Organisation>): Dictionary<any> {
    return filter((a) => typeof a !== 'undefined', {
      organisation_id: a.id,
      organisation_name: a.name,
      _360_giving_id: a._360GivingId,
      created_at: a.createdAt,
      modified_at: a.modifiedAt,
      deleted_at: a.deletedAt,
    });
  },

  async get (client: Knex, q: ModelQuery<Organisation> = {}) {
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

  async getOne (client: Knex, q: ModelQuery<Organisation>) {
    const [res] = await Organisations.get(client, { ...q, limit: 1 });
    return res || null;
  },

  async fromUser (client: Knex, q: ModelQuery<User>) {
    return client.transaction(async (trx) => {

      const exists = await Users.exists(trx, q);
      if (!exists) throw new Error('User does not exist');

      const { id } = await Users.getOne(trx, q);
      const [{ organisation_id }] = await trx('user_account_access_role')
        .select('organisation_id')
        .where({ user_account_id: id });

      const [org] = await Organisations.get(trx, { where: { id : organisation_id } });
      if (!org) throw new Error('No organisation is associated to this user');
      return org;
    });
  },

  async exists (client: Knex, q: ModelQuery<Organisation>) {
    const res = await Organisations.getOne(client, q);
    return res !== null;
  },

  async add (client: Knex, o: OrganisationChangeSet) {
    const [id] = await client('organisation')
      .insert(Organisations.toColumnNames(o))
      .returning('organisation_id');

    return Organisations.getOne(client, { where: { id } });
  },

  async update (client: Knex, o: Organisation, c: OrganisationChangeSet) {
    const preProcessOrg = compose(
      Organisations.toColumnNames,
      dropUnWhereableOrgFields
    );

    const [id] = await client('organisation')
      .update(Organisations.toColumnNames(c))
      .where(preProcessOrg(o))
      .returning('organisation_id');

    return Organisations.getOne(client, { where: { id } });
  },

  async destroy (client: Knex, o: Organisation) {
    const preProcessOrg = compose(
      Organisations.toColumnNames,
      dropUnWhereableOrgFields
    );

    return client('organisation')
      .update({ deleted_at: new Date() })
      .where(preProcessOrg(o));
  },

  async serialise (org: Organisation) {
    return org;
  },
};
