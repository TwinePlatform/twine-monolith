/*
 * User Model
 */
import * as Knex from 'knex';
import * as moment from 'moment';
import { compose, omit, filter, pick, invertObj, evolve } from 'ramda';
import { randomBytes } from 'crypto';
import { hash, compare } from 'bcrypt';
import { Map } from '../types/internal';
import {
  User,
  UserRow,
  UserCollection,
  GenderEnum,
  DisabilityEnum,
  EthnicityEnum,
  SingleUseToken,
} from './types';
import { applyQueryModifiers } from './applyQueryModifiers';
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
const applyDefaultConstants = (o: Partial<User>) => ({
  ...o,
  gender: o.gender || GenderEnum.PREFER_NOT_TO_SAY,
  ethnicity: o.ethnicity || EthnicityEnum.PREFER_NOT_TO_SAY,
  disability: o.disability || DisabilityEnum.PREFER_NOT_TO_SAY,
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
  create (a) {
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

  toColumnNames (o) {
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

  async get (client, q = {}) {
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

  async getOne (client, query = {}) {
    const [res] = await Users.get(client, { ...query, limit: 1 });
    return res || null;
  },

  async exists (client, query) {
    return null !== await Users.getOne(client, query);
  },

  async add (client, _user) {
    let user;
    if (_user.password) {
      const passwordHash = await hash(_user.password, 12);
      user = { ..._user, password: passwordHash };
    } else {
      user = { ..._user };
    }

    const preProcessUser = compose(
      mapKeys((k) => k.replace('user_account.', '')),
      transformForeignKeysToSubQueries(client),
      replaceConstantsWithForeignKeys,
      Users.toColumnNames,
      applyDefaultConstants
    );

    const [id] = await client('user_account')
      .insert(preProcessUser(user))
      .returning('user_account_id');

    return Users.getOne(client, { where: { id } });
  },

  async update (client: Knex, user, _changes) {
    let changes;
    if (_changes.password) {
      const passwordHash = await hash(_changes.password, 12);
      changes = { ..._changes, password: passwordHash };
    } else {
      changes = { ..._changes };
    }

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
      .update(preProcessChangeSet(changes))
      .where(preProcessUser(user))
      .returning('user_account_id');

    if (!id) {
      throw new Error('Unable to perform update');
    }

    return Users.getOne(client, { where: { id } });
  },

  async destroy (client, user) {
    const preProcessUser = compose(
      transformForeignKeysToSubQueries(client),
      replaceConstantsWithForeignKeys,
      Users.toColumnNames,
      dropUnwhereableUserFields
    );

    return client('user_account')
      .where(preProcessUser(user))
      .update({
        user_name: 'none',
        email: null,
        phone_number: null,
        post_code: null,
        qr_code: null,
        is_email_confirmed: false,
        is_phone_number_confirmed: false,
        is_email_contact_consent_granted: false,
        is_sms_contact_consent_granted: false,
        deleted_at: new Date(),
      });
  },

  async recordLogin (client, user) {
    return client('login_event')
      .insert({ user_account_id: user.id });
  },

  async serialise (user: User) {
    return omit(['password', 'qrCode'], user);
  },

  async createPasswordResetToken (client, user) {
    const twoDaysFromToday = moment().add(2, 'days').toISOString();
    const token = randomBytes(32).toString('hex');
    const hashToken = await hash(token, 12);

    const res = await client.transaction(async (trx) => {

      // invalidate old tokens
      await trx.raw(
        'UPDATE single_use_token '
      + 'SET expires_at = now() '
      + 'FROM user_secret_reset '
      + 'WHERE single_use_token.single_use_token_id = user_secret_reset.single_use_token_id '
      + 'AND user_secret_reset.user_account_id = ?', [user.id]);

      // create single use token
      const [tokenRow] = await trx('single_use_token')
        .insert({ token: hashToken, expires_at: twoDaysFromToday })
        .returning([
          'single_use_token_id AS id',
          'created_at AS createdAt',
          'expires_at AS expiresAt',
        ]);

      // link token to user_secret_reset table
      const [userId] = await trx('user_secret_reset')
        .insert({
          single_use_token_id: tokenRow.id,
          user_account_id:
          user.id || trx('user_account').select('user_account_id').where({ email: user.email }),
        })
        .returning('user_account_id AS userId');

      return { ...tokenRow, userId };
    });

    return { ...res, token } as SingleUseToken;
  },

  async usePasswordResetToken (client, email, token) {
    // get user
    const user = await Users.getOne(client, { where: { email } });
    if (!user) throw new Error('E-mail not recognised');

    // get valid token matching user
    const [match] = await client('single_use_token')
      .select('*')
      .innerJoin(
        'user_secret_reset',
        'user_secret_reset.single_use_token_id',
        'single_use_token.single_use_token_id')
      .innerJoin(
        'user_account',
        'user_account.user_account_id',
        'user_secret_reset.user_account_id')
      .where({
        'user_account.email': email,
        'single_use_token.used_at': null,
        'single_use_token.deleted_at': null,
      })
      .andWhereRaw('single_use_token.expires_at > ?', [moment().toISOString()]);

    if (!match) throw new Error('Token not recognised');

    // check token hash matches supplied token
    const isValid = await compare(token, match.token);

    if (!isValid) throw new Error('Token not recognised');

    // update token row as used
    await client('single_use_token')
      .update({ used_at: moment().toISOString() })
      .where({ single_use_token_id: match.single_use_token_id });

    return null;
  },
};
