/*
 * Visitor Model
 */
import { createHmac, randomBytes } from 'crypto';
import { assoc, omit, pick, evolve, compose, pipe } from 'ramda';
import { Map } from '../types/internal';
import { User, VisitorCollection, LinkedVisitEvent } from './types';
import { Users, ModelToColumn } from './user';
import { RoleEnum } from '../auth/types';
import { applyQueryModifiers } from './applyQueryModifiers';
import { getConfig } from '../../config';
import * as QRCode from '../services/qrcode';
import { ageArrayToBirthYearArray, pickOrAll } from '../utils';


const { qrcode: { secret } } = getConfig(process.env.NODE_ENV);

const hashVisitor: (visitor: Partial<User>) => string = compose(
  (s: string) => createHmac('sha256', secret).update(s).digest('hex'),
  (s: string[]) => s.concat(randomBytes(16).toString('hex')).join(':'),
  Object.values,
  pick(['email', 'name', 'gender', 'disability', 'ethnicity'])
);

/*
 * Implementation of the UserCollection type for Visitors
 */
export const Visitors: VisitorCollection = {
  create (a) {
    return Users.create({ ...a, qrCode: hashVisitor(a) });
  },

  toColumnNames (o) {
    return Users.toColumnNames(o);
  },

  async get (client, q = {}) {
    const query = evolve({
      where: Visitors.toColumnNames,
      whereNot: Visitors.toColumnNames,
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
            .where({ access_role_name: RoleEnum.VISITOR }),
        }),
      query
    );
  },

  async getOne (client, query = {}) {
    const [res] = await Visitors.get(client, { ...query, limit: 1 });
    return res || null;
  },

  async exists (client, query) {
    const res = await Visitors.getOne(client, query);
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

  async recordLogin (client, user) {
    return Users.recordLogin(client, user);
  },

  async fromCommunityBusiness (client, cb, q = {}) {
    const query = evolve({
      where: Visitors.toColumnNames,
      whereNot: Visitors.toColumnNames,
      whereBetween: pipe(evolve({ birthYear: ageArrayToBirthYearArray }), Visitors.toColumnNames),
      whereNotBetween: Visitors.toColumnNames,
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
            .where({ access_role_name: RoleEnum.VISITOR }),
          ['user_account_access_role.organisation_id']: cb.id,
        }),
      query
    );
  },

  async serialise (user) {
    const strippedUser = omit(['password', 'qrCode'], user);
    const serialisedUser = user.qrCode
      ? assoc('qrCode', await QRCode.create(user.qrCode), strippedUser)
      : strippedUser;

    return serialisedUser;
  },

  async getWithVisits (client, cb, q = {}) {
    const query = evolve({
      where: Visitors.toColumnNames,
      whereNot: Visitors.toColumnNames,
      whereBetween: pipe(evolve({ birthYear: ageArrayToBirthYearArray }), Visitors.toColumnNames),
    }, q);

    const additionalColumnMap: Map<keyof LinkedVisitEvent, string> = {
      id: 'visit_log.visit_log_id',
      createdAt: 'visit_log.created_at',
      modifiedAt: 'visit_log.modified_at',
      deletedAt: 'visit_log.deleted_at',
      userId: 'visit_log.user_account_id',
      visitActivityId: 'visit_activity.visit_activity_id',
      visitActivity: 'visit_activity.visit_activity_name',
    };

    const rows: Partial<User>[] = await applyQueryModifiers(
      client
        .select({
          id: 'user_account.user_account_id',
          ...pickOrAll(query.fields, ModelToColumn),
        })
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
            .where({
              access_role_name: RoleEnum.VISITOR,
              'user_account_access_role.organisation_id': cb.id,
            }),
        }),
      query
    );

    const userVisits: LinkedVisitEvent[][] = await Promise.all(rows.map((user) =>
      client
        .select(additionalColumnMap)
        .from('visit_log')
        .leftOuterJoin(
          'visit_activity',
          'visit_activity.visit_activity_id',
          'visit_log.visit_activity_id')
        .where({ user_account_id: user.id })
    ));

    return rows.map((row: Partial<User>, idx) => {
      const user: Partial<User> = pickOrAll(query.fields, row);
      return ({ ...user, visits: userVisits[idx] });
    });
  },
};
