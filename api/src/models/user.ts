/*
 * User Model
 */
import * as Knex from 'knex';
import { compose, omit, filter, pick, invertObj, evolve } from 'ramda';
import { Dictionary, Map } from '../types/internal';
import { User, UserRow, UserCollection, UserChangeSet, ModelQuery } from './models';
import { applyQueryModifiers } from './util';
import { renameKeys } from '../utils';

/*
 * Field name mappings
 *
 * ColumnToModel - DB column names       -> keys of the User type
 * ModelToColumn - keys of the User type -> DB column names
 */
const ColumnToModel: Map<keyof UserRow, keyof User> = {
  user_account_id: 'id',
  user_name: 'name',
  user_password: 'password',
  email: 'email',
  qr_code: 'qrCode',
  birth_year: 'birthYear',
  post_code: 'postCode',
  phone_number: 'phoneNumber',
  is_email_confirmed: 'isEmailConfirmed',
  is_phone_number_confirmed: 'isPhoneNumberConfirmed',
  is_email_contact_consent_granted: 'isEmailConsentGranted',
  is_sms_contact_consent_granted: 'isSMSConsentGranted',
  created_at: 'createdAt',
  modified_at: 'modifiedAt',
  deleted_at: 'deletedAt',
  'gender.gender_name': 'gender',
  'ethnicity.ethnicity_name': 'ethnicity',
  'disability.disability_name': 'disability',
};
const ModelToColumn = invertObj(ColumnToModel);

/*
 * Helpers for transforming query objects
 */
const applyDefaultConstants = (o: UserChangeSet) => ({
  ...o,
  gender: o.gender || 'prefer not to say',
  ethnicity: o.ethnicity || 'prefer not to say',
  disability: o.disability || 'prefer not to say',
});

const replaceConstantsWithForeignKeys = renameKeys({
  'gender.gender_name': 'gender_id',
  'ethnicity.ethnicity_name': 'ethnicity_id',
  'disability.disability_name': 'disability_id',
});

const replaceModelFieldsWithForeignKeys = renameKeys({
  gender: 'gender_id',
  ethnicity: 'ethnicity_id',
  disability: 'disability_id',
});

const transformConstantValuesToSubQueries = (client: Knex) => evolve({
  gender_id: (v: string) =>
    client('gender').select('gender_id').where({ gender_name: v }),
  disability_id: (v: string) =>
    client('disability').select('disability_id').where({ disability_name: v }),
  ethnicity_id: (v: string) =>
    client('ethnicity').select('ethnicity_id').where({ ethnicity_name: v }),
});

const dropUnWhereableUserFields = omit([
  'gender',
  'ethnicity',
  'disability',
  'createdAt',
  'modifiedAt',
  'deletedAt',
]);

/*
 * Implementation of the UserCollection type
 */
export const Users: UserCollection = {
  create (a: Partial<User>): User {
    return {
      id: a.id,
      name: a.name,
      email: a.email,
      phoneNumber: a.phoneNumber,
      password: a.password,
      qrCode: a.qrCode,
      gender: a.gender,
      disability: a.disability,
      ethnicity: a.ethnicity,
      birthYear: a.birthYear,
      postCode: a.postCode,
      isEmailConfirmed: a.isEmailConfirmed,
      isPhoneNumberConfirmed: a.isPhoneNumberConfirmed,
      isEmailConsentGranted: a.isEmailConsentGranted,
      isSMSConsentGranted: a.isSMSConsentGranted,
      createdAt: a.createdAt,
      modifiedAt: a.modifiedAt,
      deletedAt: a.deletedAt,
    };
  },

  toColumnNames (o: Partial<User>): Dictionary<any> {
    return filter((a) => typeof a !== 'undefined', {
      user_account_id: o.id,
      user_name: o.name,
      user_password: o.password,
      email: o.email,
      qr_code: o.qrCode,
      birth_year: o.birthYear,
      post_code: o.postCode,
      phone_number: o.phoneNumber,
      is_email_confirmed: o.isEmailConfirmed,
      is_phone_number_confirmed: o.isPhoneNumberConfirmed,
      is_email_contact_consent_granted: o.isEmailConsentGranted,
      is_sms_contact_consent_granted: o.isSMSConsentGranted,
      created_at: o.createdAt,
      modified_at: o.modifiedAt,
      deleted_at: o.deletedAt,
      'gender.gender_name': o.gender,
      'ethnicity.ethnicity_name': o.ethnicity,
      'disability.disability_name': o.disability,
    });
  },

  async get (client: Knex, q: ModelQuery<User> = {}) {
    const query = evolve({
      where: Users.toColumnNames,
      whereNot: Users.toColumnNames,
    }, q);

    return applyQueryModifiers(
      client
        .select(q.fields ? pick(q.fields, ModelToColumn) : ModelToColumn)
        .from('user_account')
        .leftOuterJoin('gender', 'user_account.gender_id', 'gender.gender_id')
        .leftOuterJoin('ethnicity', 'user_account.ethnicity_id', 'ethnicity.ethnicity_id')
        .leftOuterJoin('disability', 'user_account.disability_id', 'disability.disability_id'),
      query
    );
  },

  async getOne (client: Knex, q: ModelQuery<User> = {}) {
    const res = await Users.get(client, q);
    return res[0] || null;
  },

  async add (client: Knex, u: UserChangeSet) {
    const addSubQueries = compose(
      transformConstantValuesToSubQueries(client),
      replaceModelFieldsWithForeignKeys,
      applyDefaultConstants
    );

    const [id] = await client('user_account')
      .insert(addSubQueries(Users.toColumnNames(u)))
      .returning('user_account_id');

    return Users.getOne(client, { where: { id } });
  },

  async update (client: Knex, u: User, c: UserChangeSet) {
    const preProcessUser = compose(
      Users.toColumnNames,
      dropUnWhereableUserFields
    );

    const preProcessChangeSet = compose(
      transformConstantValuesToSubQueries(client),
      replaceConstantsWithForeignKeys,
      Users.toColumnNames
    );

    const [id] = await client('user_account')
      .update(preProcessChangeSet(c))
      .where(preProcessUser(u))
      .returning('user_account_id');

    return Users.getOne(client, { where: { id } });
  },

  async destroy (client: Knex, u: Partial<User>) {
    const preProcessUser = compose(
      transformConstantValuesToSubQueries(client),
      replaceConstantsWithForeignKeys,
      Users.toColumnNames
    );

    return client('user_account')
      .where(preProcessUser(u))
      .update({ deleted_at: new Date() });
  },

  serialise (user: User) {
    return omit(['password', 'qrCode'], user);
  },

  deserialise (a: Dictionary<any>) {
    return Users.create(a);
  },
};
