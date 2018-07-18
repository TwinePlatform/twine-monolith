/*
 * User Model
 */
import * as Knex from 'knex';
import { omit, filter, pick, invertObj } from 'ramda';
import { Dictionary, Map } from '../types/internal';
import { User, UserRow, UserCollection, QueryOptions } from './models';
import { applyQueryModifiers } from './util';

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
 * Implementation of the UserCollection type
 */
export const Users: UserCollection = {
  create (a: Partial<User>): User {
    return {
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

  async get (client: Knex, q: Partial<User> = {}, opts: QueryOptions<User> = {}) {
    const res = await applyQueryModifiers(
      client
        .select(opts.fields ? pick(opts.fields, ModelToColumn) : ModelToColumn)
        .from('user_account')
        .leftOuterJoin('gender', 'user_account.gender_id', 'gender.gender_id')
        .leftOuterJoin('ethnicity', 'user_account.ethnicity_id', 'ethnicity.ethnicity_id')
        .leftOuterJoin('disability', 'user_account.disability_id', 'disability.disability_id')
        .where(Users.toColumnNames(q)),
      opts
    );

    return res.map(Users.create);
  },

  serialise (user: User) {
    return omit(['password', 'qrCode'], user);
  },
};
