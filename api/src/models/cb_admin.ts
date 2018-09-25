/*
 * Community Business Admin Model
 */
import { omit, pick, evolve } from 'ramda';
import { CbAdminCollection } from './types';
import { Users, ModelToColumn } from './user';
import { RoleEnum } from '../auth/types';
import { applyQueryModifiers } from './applyQueryModifiers';


/*
 * Implementation of the UserCollection type for CbAdmin
 */
export const CbAdmins: CbAdminCollection = {
  create (a) {
    return Users.create(a);
  },

  toColumnNames (o) {
    return Users.toColumnNames(o);
  },

  async get (client, q = {}) {
    const query = evolve({
      where: CbAdmins.toColumnNames,
      whereNot: CbAdmins.toColumnNames,
    }, q);

    return applyQueryModifiers(
      client
        .select(query.fields ? pick(query.fields, ModelToColumn) : ModelToColumn)
        .from('user_account')
        .leftOuterJoin('gender', 'user_account.gender_id', 'gender.gender_id')
        .leftOuterJoin('ethnicity', 'user_account.ethnicity_id', 'ethnicity.ethnicity_id')
        .leftOuterJoin('disability', 'user_account.disability_id', 'disability.disability_id')
        .leftOuterJoin(
          'user_account_access_role',
          'user_account.user_account_id',
          'user_account_access_role.user_account_id')
        .where({
          ['user_account_access_role.access_role_id']: client('access_role')
            .select('access_role_id')
            .where({ access_role_name: RoleEnum.ORG_ADMIN }),
        }),
      query
    );
  },

  async getOne (client, query = {}) {
    const res = await CbAdmins.get(client, { ...query, limit: 1 });
    return res[0] || null;
  },

  async exists (client, query = {}) {
    const res = await CbAdmins.getOne(client, query);
    return res !== null;
  },

  async add (client, user) {
    return Users.add(client, user);
  },

  async update (client, user, changes) {
    return Users.update(client, user, changes);
  },

  async destroy (client, user) {
    return Users.destroy(client, user);
  },

  async fromOrganisation (client, organisation) {
    return client
        .select(ModelToColumn)
        .from('user_account')
        .leftOuterJoin('gender', 'user_account.gender_id', 'gender.gender_id')
        .leftOuterJoin('ethnicity', 'user_account.ethnicity_id', 'ethnicity.ethnicity_id')
        .leftOuterJoin('disability', 'user_account.disability_id', 'disability.disability_id')
        .leftOuterJoin(
          'user_account_access_role',
          'user_account.user_account_id',
          'user_account_access_role.user_account_id')
        .where({
          'user_account.deleted_at': null,
          ['user_account_access_role.access_role_id']: client('access_role')
            .select('access_role_id')
            .where({ access_role_name: RoleEnum.ORG_ADMIN }),
          ['user_account_access_role.organisation_id']: organisation.id,
        });
  },

  async recordLogin (client, user) {
    return Users.recordLogin(client, user);
  },

  async serialise (user) {
    return omit(['password', 'qrCode'], user);
  },
};
