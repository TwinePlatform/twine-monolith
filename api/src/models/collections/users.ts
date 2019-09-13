import * as Knex from 'knex';
import { has, filter, pick, pickAll, omit } from 'ramda';
import { UserCollection, User, ModelQuery, WhereBetweenQuery, ModelQueryPartial, WhereQuery } from '../types/index';
import { applyQueryModifiers } from '../query_util';
import { UserModelRecord } from '../types/collection';
import { Objects } from 'twine-util';


export const Users: UserCollection = {
  _recordToModelMap: {
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
    'user_account.is_temp': 'isTemp',
    'user_account.created_at': 'createdAt',
    'user_account.modified_at': 'modifiedAt',
    'user_account.deleted_at': 'deletedAt',
    'gender.gender_name': 'gender',
    'ethnicity.ethnicity_name': 'ethnicity',
    'disability.disability_name': 'disability',
  },

  _modelToRecordMap: {
    id: 'user_account.user_account_id',
    name: 'user_account.user_name',
    password: 'user_account.user_password',
    email: 'user_account.email',
    qrCode: 'user_account.qr_code',
    birthYear: 'user_account.birth_year',
    postCode: 'user_account.post_code',
    phoneNumber: 'user_account.phone_number',
    isEmailConfirmed: 'user_account.is_email_confirmed',
    isPhoneNumberConfirmed: 'user_account.is_phone_number_confirmed',
    isEmailConsentGranted: 'user_account.is_email_contact_consent_granted',
    isSMSConsentGranted: 'user_account.is_sms_contact_consent_granted',
    isTemp: 'user_account.is_temp',
    createdAt: 'user_account.created_at',
    modifiedAt: 'user_account.modified_at',
    deletedAt: 'user_account.deleted_at',
    gender: 'gender.gender_name',
    ethnicity: 'ethnicity.ethnicity_name',
    disability: 'disability.disability_name',
  },

  _toColumnNames(a: WhereQuery<User> | WhereBetweenQuery<User>) {
    return filter((x) => !!x, {
      'user_account.user_account_id': a.id,
      'user_account.user_name': a.name,
      'user_account.user_password': a.password,
      'user_account.email': a.email,
      'user_account.qr_code': a.qrCode,
      'user_account.birth_year': a.birthYear,
      'user_account.post_code': a.postCode,
      'user_account.phone_number': a.phoneNumber,
      'user_account.is_email_confirmed': a.isEmailConfirmed,
      'user_account.is_phone_number_confirmed': a.isPhoneNumberConfirmed,
      'user_account.is_email_contact_consent_granted': a.isEmailConsentGranted,
      'user_account.is_sms_contact_consent_granted': a.isSMSConsentGranted,
      'user_account.is_temp': a.isTemp,
      'user_account.created_at': a.createdAt,
      'user_account.modified_at': a.modifiedAt,
      'user_account.deleted_at': a.deletedAt,
      'gender.gender_name': a.gender,
      'ethnicity.ethnicity_name': a.ethnicity,
      'disability.disability_name': a.disability,
    });
  },

  cast(a) {
    return filter((c) => !!c, pickAll<typeof a, Partial<User>>(Object.keys(Users._modelToRecordMap), a));
  },

  async serialise(a) {
    return omit(['password', 'qrCode'], a);
  },

  async get(client: Knex, query: ModelQuery<User> | ModelQueryPartial<User>) {
    const _q = {
      order: [Users._modelToRecordMap[query.order[0]], query.order[1]] as [keyof UserModelRecord, 'asc' | 'desc'],
      where: Users._toColumnNames(query.where),
      whereNot: Users._toColumnNames(query.whereNot),
      whereBetween: Users._toColumnNames(query.whereBetween),
      whereNotBetween: Users._toColumnNames(query.whereNotBetween),
      limit: query.limit,
      offset: query.offset,
      fields: 'fields' in query ? query.fields : undefined,
    };

    const q = applyQueryModifiers<UserModelRecord, User[], UserModelRecord>(
      client<UserModelRecord, User[]>('user_account')
        .leftOuterJoin('gender', 'gender.gender_id', 'user_account.gender_id')
        .leftOuterJoin('disability', 'disability.disability_id', 'user_account.gender_id')
        .leftOuterJoin('ethnicity', 'ethnicity.ethnicity_id', 'user_account.ethnicity_id'),
      _q
    );

    if ('fields' in query) {
      return q.select(pick(query.fields, Users._modelToRecordMap));

    } else {
      const x = await q.select<UserModelRecord, User[]>();
      return x;
    }
  },
};
