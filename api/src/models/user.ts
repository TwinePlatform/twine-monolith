/*
 * User Model
 */
import * as Knex from 'knex';
import { compose, omit, filter, pick, invertObj, evolve } from 'ramda';
import { Dictionary, Map } from '../types/internal';
import { User, UserRow, UserCollection, UserChangeSet, ModelQuery } from './models';
import { applyQueryModifiers } from './util';
import { renameKeys, mapKeys } from '../utils';

/*
 * Field name mappings
 *
 * ColumnToModel - DB column names       -> keys of the User type
 * ModelToColumn - keys of the User type -> DB column names
 */
export const ColumnToModel: Map<keyof UserRow, keyof User> = {
  'user_account.user_account_id': 'id',
  'user_account.user_name': 'name',
  'user_account.user_password': 'password',
  'user_account.email': 'email',
  'user_account.qr_code': 'qrCode',
  'user_account.birth_year': 'birthYear',
  'user_account.post_code': 'postCode',
  'user_account.phone_number': 'phoneNumber',
  'user_account.is_email_confirmed': 'isEmailConfirmed',
  'user_account.is_phone_number_confirmed': 'isPhoneNumberConfirmed',
  'user_account.is_email_contact_consent_granted': 'isEmailConsentGranted',
  'user_account.is_sms_contact_consent_granted': 'isSMSConsentGranted',
  'user_account.created_at': 'createdAt',
  'user_account.modified_at': 'modifiedAt',
  'user_account.deleted_at': 'deletedAt',
  'gender.gender_name': 'gender',
  'ethnicity.ethnicity_name': 'ethnicity',
  'disability.disability_name': 'disability',
};
export const ModelToColumn = invertObj(ColumnToModel);

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

const transformForeignKeysToSubQueries = (client: Knex) => evolve({
  gender_id: (v: string) =>
    client('gender').select('gender_id').where({ gender_name: v }),
  disability_id: (v: string) =>
    client('disability').select('disability_id').where({ disability_name: v }),
  ethnicity_id: (v: string) =>
    client('ethnicity').select('ethnicity_id').where({ ethnicity_name: v }),
});

const dropUnwhereableUserFields = omit([
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
      'user_account.user_account_id': o.id,
      'user_account.user_name': o.name,
      'user_account.user_password': o.password,
      'user_account.email': o.email,
      'user_account.qr_code': o.qrCode,
      'user_account.birth_year': o.birthYear,
      'user_account.post_code': o.postCode,
      'user_account.phone_number': o.phoneNumber,
      'user_account.is_email_confirmed': o.isEmailConfirmed,
      'user_account.is_phone_number_confirmed': o.isPhoneNumberConfirmed,
      'user_account.is_email_contact_consent_granted': o.isEmailConsentGranted,
      'user_account.is_sms_contact_consent_granted': o.isSMSConsentGranted,
      'user_account.created_at': o.createdAt,
      'user_account.modified_at': o.modifiedAt,
      'user_account.deleted_at': o.deletedAt,
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
        .select(query.fields ? pick(query.fields, ModelToColumn) : ModelToColumn)
        .from('user_account')
        .leftOuterJoin('gender', 'user_account.gender_id', 'gender.gender_id')
        .leftOuterJoin('ethnicity', 'user_account.ethnicity_id', 'ethnicity.ethnicity_id')
        .leftOuterJoin('disability', 'user_account.disability_id', 'disability.disability_id'),
      query
    );
  },

  async getOne (client: Knex, q: ModelQuery<User> = {}) {
    const [res] = await Users.get(client, { ...q, limit: 1 });
    return res || null;
  },

  async add (client: Knex, u: UserChangeSet) {
    const preProcessUser = compose(
      mapKeys((k) => k.replace('user_account.', '')),
      transformForeignKeysToSubQueries(client),
      replaceConstantsWithForeignKeys,
      Users.toColumnNames,
      applyDefaultConstants
    );

    const [id] = await client('user_account')
      .insert(preProcessUser(u))
      .returning('user_account_id');

    return Users.getOne(client, { where: { id } });
  },

  async update (client: Knex, u: User, c: UserChangeSet) {
    const preProcessUser = compose(
      Users.toColumnNames,
      dropUnwhereableUserFields
    );

    const preProcessChangeSet = compose(
      mapKeys((k) => k.replace('user_account.', '')),
      transformForeignKeysToSubQueries(client),
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
      transformForeignKeysToSubQueries(client),
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
};
