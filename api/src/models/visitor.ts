/*
 * Visitor Model
 */
import { createHmac } from 'crypto';
import * as Knex from 'knex';
import { assoc, omit, pick, evolve, compose, pipe } from 'ramda';
import { Dictionary } from '../types/internal';
import {
  User,
  UserCollection,
  UserChangeSet,
  ModelQuery,
  LinkedVisitEvent,
  CommunityBusiness
} from './types';
import { Users, ModelToColumn } from './user';
import { RoleEnum } from '../auth/types';
import { applyQueryModifiers } from './applyQueryModifiers';
import { getConfig } from '../../config';
import * as QRCode from '../services/qrcode';
import { renameKeys, ageArrayToBirthYearArray } from '../utils';


/*
 * Declarations for methods specific to this model
 */
type UserWithVisits = User & {
  visits: LinkedVisitEvent[]
};
type CustomMethods = {
  recordLogin: (k: Knex, u: User) => Promise<void>
  getWithVisits: (k: Knex, c: CommunityBusiness, q?: ModelQuery<User>) => Promise<UserWithVisits[]>
  fromCommunityBusiness: (client: Knex, c: CommunityBusiness, q?: ModelQuery<User>) =>
    Promise<User[]>
};


const { qrcode: { secret } } = getConfig(process.env.NODE_ENV);

const hashVisitor: (visitor: Partial<User>) => string = compose(
  (s: string) => createHmac('sha256', secret).update(s).digest('hex'),
  (s: string[]) => s.join(':'),
  Object.values,
  pick(['email', 'name', 'gender', 'disability', 'ethnicity'])
);

/*
 * Implementation of the UserCollection type for Visitors
 */
export const Visitors: UserCollection & CustomMethods = {
  create (a: Partial<User>): User {
    return Users.create({ ...a, qrCode: hashVisitor(a) });
  },

  toColumnNames (o: Partial<User>): Dictionary<any> {
    return Users.toColumnNames(o);
  },

  async get (client: Knex, q: ModelQuery<User> = {}) {
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

  async getOne (client: Knex, q: ModelQuery<User> = {}) {
    const [res] = await Visitors.get(client, { ...q, limit: 1 });
    return res || null;
  },

  async exists (client: Knex, q: ModelQuery<User>) {
    const res = await Visitors.getOne(client, q);
    return res !== null;
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

  async recordLogin (client: Knex, u: User) {
    return Users.recordLogin(client, u);
  },

  async fromCommunityBusiness (client: Knex, c: CommunityBusiness, q: ModelQuery<User> = {}) {
    const query = evolve({
      where: Visitors.toColumnNames,
      whereNot: Visitors.toColumnNames,
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
        .where({
          ['user_account_access_role.access_role_id']: client('access_role')
            .select('access_role_id')
            .where({ access_role_name: RoleEnum.VISITOR }),
          ['user_account_access_role.organisation_id']: c.id,
        }),
      query
    );
  },

  async serialise (user: Partial<User>) {
    const strippedUser = omit(['password', 'qrCode'], user);
    const serialisedUser = user.qrCode
      ? assoc('qrCode', await QRCode.create(user.qrCode), strippedUser)
      : strippedUser;

    return serialisedUser;
  },

  async getWithVisits (client: Knex, c: CommunityBusiness, q: ModelQuery<User> = {}) {
    const query = evolve({
      where: Visitors.toColumnNames,
      whereNot: Visitors.toColumnNames,
      whereBetween: pipe(
        evolve({ birthYear: ageArrayToBirthYearArray }),
        renameKeys({ birthYear: 'user_account.birth_year' })
        ),
    }, q);

    const additionalColumnMap = {
      visitId: 'visit.visit_id',
      visitCreatedAt: 'visit.created_at',
      visitModifiedAt: 'visit.modified_at',
      visitDeletedAt: 'visit.deleted_at',
      visitActivityId: 'visit_activity.visit_activity_id',
      visitActivityName: 'visit_activity.visit_activity_name',
    };

    const rows = await applyQueryModifiers(
      client
        .select({
          ...(query.fields ? pick(query.fields, ModelToColumn) : ModelToColumn),
          ...additionalColumnMap,
        })
        .from('user_account')
        .leftOuterJoin('gender', 'user_account.gender_id', 'gender.gender_id')
        .leftOuterJoin('ethnicity', 'user_account.ethnicity_id', 'ethnicity.ethnicity_id')
        .leftOuterJoin('disability', 'user_account.disability_id', 'disability.disability_id')
        .leftOuterJoin(
          'user_account_access_role',
          'user_account.user_account_id',
          'user_account_access_role.user_account_id')
        .leftOuterJoin(
          'visit',
          'visit.user_account_id',
          'user_account.user_account_id')
        .leftOuterJoin(
          'visit_activity',
          'visit.visit_activity_id',
          'visit_activity.visit_activity_id')
        .where({
          ['user_account_access_role.access_role_id']: client('access_role')
            .select('access_role_id')
            .where({
              access_role_name: RoleEnum.VISITOR,
              'user_account_access_role.organisation_id': c.id,
            }),
        }),
      query
    );

    return Object.values(
      rows.reduce((
        acc: Dictionary<UserWithVisits>,
        row: User & {
          visitId: number
          visitCreatedAt: string
          visitModifiedAt: string
          visitDeletedAt: string
          visitActivityName: string
          visitActivityId: number
        }
      ) => {
        const {
          visitCreatedAt,
          visitModifiedAt,
          visitDeletedAt,
          visitActivityName,
          visitActivityId,
          visitId,
          ...rest
        } = row;

        if (acc.hasOwnProperty(rest.id)) {
          acc[rest.id].visits.push({
            id: visitId,
            userId: rest.id,
            createdAt: visitCreatedAt,
            modifiedAt: visitModifiedAt,
            deletedAt: visitDeletedAt,
            visitActivity: visitActivityName,
            visitActivityId,
          });
        } else {
          acc[rest.id] = {
            ...rest,
            visits: [{
              id: visitId,
              userId: rest.id,
              createdAt: visitCreatedAt,
              modifiedAt: visitModifiedAt,
              deletedAt: visitDeletedAt,
              visitActivity: visitActivityName,
              visitActivityId,
            }],
          };
        }

        return acc;
      }, {})
    );
  },
};
