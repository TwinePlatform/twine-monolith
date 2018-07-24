/*
 * Community Business Admin Model
 */
import * as Knex from 'knex';
import { omit, pick, evolve } from 'ramda';
import { Dictionary } from '../types/internal';
import { User, UserCollection, UserChangeSet, ModelQuery } from './models';
import { Users, ModelToColumn } from './user';
import { Role } from '../auth/permissions/types';
import { applyQueryModifiers } from './util';


/*
 * Implementation of the UserCollection type for CbAdmin
 */
export const CbAdmin: UserCollection = {
  create (a: Partial<User>): User {
    return Users.create(a);
  },

  toColumnNames (o: Partial<User>): Dictionary<any> {
    return Users.toColumnNames(o);
  },

  async get (client: Knex, q: ModelQuery<User> = {}) {
    const query = evolve({
      where: CbAdmin.toColumnNames,
      whereNot: CbAdmin.toColumnNames,
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
            .where({ access_role_name: Role.ORG_ADMIN }),
        }),
      query
    );
  },

  async getOne (client: Knex, q: ModelQuery<User> = {}) {
    const res = await CbAdmin.get(client, q);
    return res[0] || null;
  },

  async add (client: Knex, u: UserChangeSet) {
    return Users.add(client, u);
  },

  async update (client: Knex, u: User, c: UserChangeSet) {
    return Users.update(client, u, c);
  },

  async destroy (client: Knex, u: Partial<User>) {
    return Users.destroy(client, u);
  },

  serialise (user: User) {
    return omit(['password', 'qrCode'], user);
  },

  deserialise (a: Dictionary<any>) {
    return CbAdmin.create(a);
  },
};
