/*
 * Volunteer Model
 */
import { pick, evolve } from 'ramda';
import { VolunteerCollection, RoleEnum } from './types';
import { Users, ModelToColumn } from './user';
import { applyQueryModifiers } from './applyQueryModifiers';
import Roles from './role';

/*
 * Implementation of the UserCollection type for Volunteers
 */
export const Volunteers: VolunteerCollection = {
  create(a) {
    return Users.create(a);
  },

  toColumnNames(o) {
    return Users.toColumnNames(o);
  },

  async get(client, q = {}) {
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

  async getOne(client, query = {}) {
    const [res] = await Volunteers.get(client, { ...query, limit: 1 });
    return res || null;
  },

  async exists(client, query) {
    const res = await Volunteers.getOne(client, query);
    return res !== null;
  },

  async add(client, user) {
    return Users.add(client, user);
  },

  async addWithRole(client, user, volunteerType, cb, code) {

    switch (volunteerType) {

      case RoleEnum.VOLUNTEER:
        return client.transaction(async (trx) => {
          const newUser = await Users.add(trx, user);
          await Roles.add(trx, { role: volunteerType, userId: newUser.id, organisationId: cb.id });
          return newUser;
        });

      case RoleEnum.VOLUNTEER_ADMIN:
        if (! await Volunteers.adminCodeIsValid(client, cb, code)) {
          throw new Error('Invalid volunteer admin code');
        }

        return client.transaction(async (trx) => {
          const newUser = await Users.add(trx, user);

          await Roles.add(trx, { role: volunteerType, userId: newUser.id, organisationId: cb.id });
          return newUser;
        });
    }
  },

  async update(client, user, changes) {
    if (await Volunteers.exists(client, { where: { id: user.id } })) {
      return Users.update(client, user, changes);
    }
    throw new Error('User is not a volunteer');
  },

  async destroy(client, user) {
    if (await Volunteers.exists(client, { where: { id: user.id } })) {
      return Users.destroy(client, user);
    }
    throw new Error('User is not a volunteer');
  },

  async fromCommunityBusiness(client, cb, q = {}) {
    const query = evolve({
      where: Volunteers.toColumnNames,
      whereNot: Volunteers.toColumnNames,
      whereBetween: Volunteers.toColumnNames,
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

  async fromProjectWithToken(client, cb, vp) {

    // sql: select distinct user_account.push_token from user_account inner join volunteer_hours_log 
    //ON user_account.user_account_id = volunteer_hours_log.user_account_id where volunteer_hours_log.organisation_id = 2
    //AND volunteer_hours_log.volunteer_project_id = 1;

    const res = await client('user_account')
      .distinct('push_token')
      .from('user_account')
      .join('volunteer_hours_log', 'user_account.user_account_id', '=', 'volunteer_hours_log.user_account_id')
      .where({
        'volunteer_hours_log.organisation_id': cb.id,
        'volunteer_hours_log.volunteer_project_id': vp
      });

    return res;
  },



  async adminCodeIsValid(client, cb, code) {
    const [row] = await client('volunteer_admin_code')
      .where({
        code,
        organisation_id: cb.id,
      });
    return Boolean(row);
  },
};
