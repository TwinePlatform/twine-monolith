import * as Knex from 'knex';
import { evolve, pick, omit } from 'ramda';
import { Objects } from 'twine-util';
import { hash } from 'bcrypt';
import { applyQueryModifiers } from '../query_util';
import Roles from '../role';
import {
  GenderEnum,
  UserModelRecord,
  UserCollection,
  User,
  ModelQuery,
  WhereBetweenQuery,
  ModelQueryPartial,
  WhereQuery,
  EthnicityEnum,
  DisabilityEnum
} from '../types/index';
import { isWhereBetween } from '../util';


export const modelToRecordMap = {
  id: 'user_account.user_account_id' as keyof UserModelRecord,
  name: 'user_account.user_name' as keyof UserModelRecord,
  password: 'user_account.user_password' as keyof UserModelRecord,
  email: 'user_account.email' as keyof UserModelRecord,
  qrCode: 'user_account.qr_code' as keyof UserModelRecord,
  birthYear: 'user_account.birth_year' as keyof UserModelRecord,
  postCode: 'user_account.post_code' as keyof UserModelRecord,
  phoneNumber: 'user_account.phone_number' as keyof UserModelRecord,
  isEmailConfirmed: 'user_account.is_email_confirmed' as keyof UserModelRecord,
  isPhoneNumberConfirmed: 'user_account.is_phone_number_confirmed' as keyof UserModelRecord,
  isEmailConsentGranted: 'user_account.is_email_contact_consent_granted' as keyof UserModelRecord,
  isSMSConsentGranted: 'user_account.is_sms_contact_consent_granted' as keyof UserModelRecord,
  isTemp: 'user_account.is_temp' as keyof UserModelRecord,
  createdAt: 'user_account.created_at' as keyof UserModelRecord,
  modifiedAt: 'user_account.modified_at' as keyof UserModelRecord,
  deletedAt: 'user_account.deleted_at' as keyof UserModelRecord,
  gender: 'gender.gender_name' as keyof UserModelRecord,
  ethnicity: 'ethnicity.ethnicity_name' as keyof UserModelRecord,
  disability: 'disability.disability_name' as keyof UserModelRecord,
}


/*
 * Helpers for transforming query objects
 */
const applyDefaultConstants = (o: Partial<User>) => ({
  ...o,
  gender: o.gender || GenderEnum.PREFER_NOT_TO_SAY,
  ethnicity: o.ethnicity || EthnicityEnum.PREFER_NOT_TO_SAY,
  disability: o.disability || DisabilityEnum.PREFER_NOT_TO_SAY,
});

const replaceConstantsWithForeignKeys = Objects.renameKeys({
  'gender.gender_name': 'gender_id',
  'ethnicity.ethnicity_name': 'ethnicity_id',
  'disability.disability_name': 'disability_id',
});

const transformForeignKeysToSubQueries = (client: Knex) => evolve({
  gender_id: (v: string) =>
    client('gender').select('gender_id').where({ gender_name: v, deleted_at: null }),
  disability_id: (v: string) =>
    client('disability').select('disability_id').where({ disability_name: v, deleted_at: null }),
  ethnicity_id: (v: string) =>
    client('ethnicity').select('ethnicity_id').where({ ethnicity_name: v, deleted_at: null }),
});

/**
 * Pre-processing
 */

const preProcessUser = (client: Knex, user: Partial<User>) => {
  const x = applyDefaultConstants(user);
  const y = Users._toColumnNames(x); // eslint-disable-line @typescript-eslint/no-use-before-define
  const z = replaceConstantsWithForeignKeys(y);
  const a = transformForeignKeysToSubQueries(client)(z);
  return Objects.mapKeys((k) => k.replace('user_account.', ''))(a);
};

const preProcessChangeSet = (client: Knex, user: Partial<User>) => {
  const x = Users._toColumnNames(user); // eslint-disable-line @typescript-eslint/no-use-before-define
  const y = replaceConstantsWithForeignKeys(x);
  const z = transformForeignKeysToSubQueries(client)(y);
  return Objects.mapKeys((k) => k.replace('user_account', ''))(z);
};


export const Users: UserCollection = {
  _toColumnNames(a: WhereQuery<User> | WhereBetweenQuery<User>): any {
    if (isWhereBetween(a)) {
      return Objects.renameKeys(modelToRecordMap)(a) as WhereBetweenQuery<UserModelRecord>;
    } else {
      return Objects.renameKeys(modelToRecordMap)(a) as WhereQuery<UserModelRecord>;
    }
  },

  cast(a, tag) {
    return {
      __model: true,
      __tag: tag,
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
      isTemp: a.isTemp,
    } as Partial<User>;
  },

  async serialise(user) {
    return omit(['password', 'qrCode'], user);
  },

  async exists (client, query) {
    return null !== Users.getOne(client, { where: query });
  },

  async get (client: Knex, query: ModelQuery<User> | ModelQueryPartial<User>) {
    const _q = {
      where: Users._toColumnNames(query.where),
      whereNot: Users._toColumnNames(query.whereNot),
      whereBetween: Users._toColumnNames(query.whereBetween),
      whereNotBetween: Users._toColumnNames(query.whereNotBetween),
      limit: query.limit,
      offset: query.offset,
    };

    const x = applyQueryModifiers<UserModelRecord, User[], UserModelRecord>(
      client<UserModelRecord, User[]>('user_account')
        .leftOuterJoin('gender', 'gender.gender_id', 'user_account.gender_id')
        .leftOuterJoin('disability', 'disability.disability_id', 'user_account.gender_id')
        .leftOuterJoin('ethnicity', 'ethnicity.ethnicity_id', 'user_account.ethnicity_id'),
      _q
    );

    if ('fields' in query) {
      return x.select(pick(query.fields, modelToRecordMap)) as Knex.QueryBuilder<UserModelRecord, Partial<User>[]>;
    } else {
      return x.select(modelToRecordMap) as Knex.QueryBuilder<UserModelRecord, User[]>;
    }
  },

  async getOne (client: Knex, query: ModelQuery<User> | ModelQueryPartial<User>) {
    const [res] = await Users.get(client, query);
    return res || null;
  },

  async create(client, _user) {
    const password = _user.password ? await hash(_user.password, 12) : undefined;
    const user = Object.assign({}, _user, { password });

    const [id] = await client<UserModelRecord, Pick<User, 'id'>>('user_account')
      .insert(preProcessUser(client, user))
      .returning('user_account_id');

    return Users.getOne(client, { where: { id } });
  },

  async update(client, query, _changes) {
    const _q = {
      where: Users._toColumnNames(query.where),
      whereNot: Users._toColumnNames(query.whereNot),
      whereBetween: Users._toColumnNames(query.whereBetween),
      whereNotBetween: Users._toColumnNames(query.whereNotBetween),
    };

    let changes;
    if (_changes.password) {
      const passwordHash = await hash(_changes.password, 12);
      changes = Object.assign({}, _changes, { password: passwordHash });
    } else {
      changes = Object.assign({}, _changes);
    }

    const ids = await applyQueryModifiers(
      client('user_account')
        .update(preProcessChangeSet(client, changes))
        .returning('user_account_id'),
      _q
    );

    if (ids.length === 0) {
      throw new Error('Unable to perform update');
    }

    return Promise.all(ids.map((id) => Users.getOne(client, { where: { id } })));
  },

  async delete(client, query) {
    return Users.update(client, query, {
      name: 'none',
      email: null,
      phoneNumber: null,
      postCode: null,
      qrCode: null,
      isEmailConfirmed: false,
      isPhoneNumberConfirmed: false,
      isEmailConsentGranted: false,
      isSMSConsentGranted: false,
      deletedAt: new Date(),
    });
  },

  async destroy(client, query) {
    const ids = await applyQueryModifiers(
      client('user_account')
        .delete('user_account_id'),
      query
    )

    if (ids.length === 0) {
      throw new Error('Unable to perform delete');
    }

    return Promise.all(ids.map((id) => Users.getOne(client, { where: { id } })));
  },

  async isMemberOf(client, user, communityBusiness) {
    const currentRoles = await Roles.fromUser(client, user);
    // currently not supporting roles at different cbs
    return currentRoles.every((x) => x.organisationId === communityBusiness.id);
  },
};
