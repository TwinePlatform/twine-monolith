/*
 * Volunteer Model
 */
import { omit, pick, evolve } from 'ramda';
import { VolunteerCollection } from './types';
import { Users, ModelToColumn } from './user';
import { RoleEnum } from '../auth/types';
import { applyQueryModifiers } from './applyQueryModifiers';

/*
 * Implementation of the UserCollection type for Volunteers
 */
export const Volunteers: VolunteerCollection = {
  create (a) {
    return Users.create(a);
  },

  toColumnNames (o) {
    return Users.toColumnNames(o);
  },

  async get (client, q = {}) {
    const query = evolve({
      where: Volunteers.toColumnNames,
      whereNot: Volunteers.toColumnNames,
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
        .whereIn(
          'user_account_access_role.access_role_id', client('access_role')
            .select('access_role_id')
            .whereIn('access_role_name', [RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN])
        ),
      query
    );
  },

  async getOne (client, query = {}) {
    const [res] = await Volunteers.get(client, { ...query, limit: 1 });
    return res || null;
  },

  async exists (client, query) {
    const res = await Volunteers.getOne(client, query);
    return res !== null;
  },

  async add (client, user) {
    return Users.add(client, user);
  },

  async update (client, user, changes) {
    if (await Volunteers.exists(client, { where: { id: user.id } })) {
      return Users.update(client, user, changes);
    }
    throw new Error('User is not a volunteer');
  },

  async destroy (client, user) {
    return Users.destroy(client, user);
  },

  async recordLogin (client, user) {
    return Users.recordLogin(client, user);
  },

  async fromCommunityBusiness (client, cb, q = {}) {
    const query = evolve({
      where: Volunteers.toColumnNames,
      whereNot: Volunteers.toColumnNames,
    }, q);

    return applyQueryModifiers(
      client
        .select(ModelToColumn)
        .from('user_account')
        .leftOuterJoin('gender', 'user_account.gender_id', 'gender.gender_id')
        .leftOuterJoin('ethnicity', 'user_account.ethnicity_id', 'ethnicity.ethnicity_id')
        .leftOuterJoin('disability', 'user_account.disability_id', 'disability.disability_id')
        .leftOuterJoin(
          'user_account_access_role',
          'user_account.user_account_id',
          'user_account_access_role.user_account_id')
        .whereIn(
          'user_account_access_role.access_role_id', client('access_role')
            .select('access_role_id')
            .where({ ['user_account_access_role.organisation_id']: cb.id })
            .whereIn('access_role_name', [RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN])
        ),
      query
    );
  },

  async serialise (user) {
    return omit(['password', 'qrCode'], user);
  },
};
