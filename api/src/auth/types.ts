import * as Knex from 'knex';
import { Dictionary } from 'ramda';
import { Omit } from '../types/internal';


export enum RoleEnum {
  VISITOR = 'VISITOR',
  VOLUNTEER = 'VOLUNTEER',
  VOLUNTEER_ADMIN = 'VOLUNTEER_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  ORG_NON_ADMIN = 'ORG_NON_ADMIN',
  TWINE_ADMIN = 'TWINE_ADMIN',
  SYS_ADMIN = 'SYS_ADMIN',
}

export enum AccessEnum {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
}

export enum ResourceEnum {
  CONSTANTS = 'constants',
  ORG_DETAILS = 'organisations_details',
  ORG_SUBSCRIPTIONS = 'organisations_subscriptions',
  ORG_FEEDBACK = 'organisations_feedback',
  ORG_TRAINING = 'organisations_training',
  ORG_INVITATIONS = 'organisations_invitations',
  ORG_OUTREACH = 'organisations_outreach',
  USERS_DETAILS = 'users_details',
  VOLUNTEER_ACTIVITIES = 'volunteer_activities',
  VOLUNTEER_LOGS = 'volunteer_logs',
  VISIT_ACTIVITIES = 'visit_activites',
  VISIT_LOGS = 'visit_logs',
}

export enum PermissionLevelEnum {
  OWN = 'own',
  CHILD = 'child',
  PARENT = 'parent',
  ALL = 'all',
}

type QueryResponse = Dictionary<any>;

export type GetPermissionIds =
  (a: {
    client: Knex,
    resource: ResourceEnum,
    permissionLevel: PermissionLevelEnum,
    access: AccessEnum,
  }) => Knex.QueryBuilder;

export type GetRoleId =
  (a: {
    client: Knex,
    role: RoleEnum,
  }) => Promise<string>; // this should be number, potentially a problem with Knex types

type PermissionQuery = {
  resource: ResourceEnum
  permissionLevel: PermissionLevelEnum
  access: AccessEnum
  role: RoleEnum
};

type UserPermissionQuery = Omit<PermissionQuery, 'role'> & { userId: number };

type RoleQuery = {
  role: RoleEnum
  userId: number
  organisationId: number
};

type MoveRoleQuery = Omit<RoleQuery, 'role'> & { from: RoleEnum, to: RoleEnum };

export type PermissionInterface = {
  grantExisting: (k: Knex, a: PermissionQuery) => Promise<QueryResponse>

  grantNew: (k: Knex, a: PermissionQuery) => Promise<QueryResponse>

  revoke: (k: Knex, a: PermissionQuery) => Promise<QueryResponse>

  roleHas: (k: Knex, a: PermissionQuery) => Promise<boolean>

  userHas: (k: Knex, a: UserPermissionQuery) => Promise<boolean>

  forRole: (k: Knex, r: RoleEnum) => Promise<QueryResponse[]>,
};

export type RolesInterface = {
  add: (k: Knex, a: { role: RoleEnum, userId: number, organisationId: number }) =>
    Promise<QueryResponse>,

  remove: (k: Knex, a: { role: RoleEnum, userId: number, organisationId: number }) =>
    Promise<QueryResponse>,

  move: (k: Knex, a: { to: RoleEnum, from: RoleEnum, userId: number, organisationId: number }) =>
    Promise<QueryResponse>,

  removeUserFromAll: (k: Knex, a: { userId: number, organisationId: number }) =>
    Promise<QueryResponse[]>,

  userHas: (k: Knex, a: { role: RoleEnum, userId: number, organisationId: number }) =>
    Promise<boolean>,

  fromUser: (k: Knex, a: { userId: number, organisationId: number}) =>
    Promise<RoleEnum>,
};

export type RolesInitialiser = (client: Knex) => RolesInterface;
