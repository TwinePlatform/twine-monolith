import * as Knex from 'knex';
import { Dictionary } from 'ramda';
import { Omit } from '../types/internal';


/*
 * Enumerations
 */

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


/*
 * Input query types
 */

type QueryResponse = Dictionary<any>;

type PermissionQuery = {
  resource: ResourceEnum
  permissionLevel: PermissionLevelEnum
  access: AccessEnum
  role: RoleEnum
};
type UserPermissionQuery = Omit<PermissionQuery, 'role'> & { userId: number };
type RolePermissionQuery = { role: RoleEnum };

type RoleQuery = {
  role: RoleEnum
  userId: number
  organisationId: number
};
type MoveRoleQuery = Omit<RoleQuery, 'role'> & { from: RoleEnum, to: RoleEnum };
type UserRoleQuery = Omit<RoleQuery, 'role'>;


/*
 * Module interfaces
 */

export type PermissionInterface = {
  grantExisting: (k: Knex, a: PermissionQuery) => Promise<QueryResponse>

  grantNew: (k: Knex, a: PermissionQuery) => Promise<QueryResponse>

  revoke: (k: Knex, a: PermissionQuery) => Promise<QueryResponse>

  roleHas: (k: Knex, a: PermissionQuery) => Promise<boolean>

  userHas: (k: Knex, a: UserPermissionQuery) => Promise<boolean>

  forRole: (k: Knex, a: RolePermissionQuery) => Promise<QueryResponse[]>,
};

export type RolesInterface = {
  add: (k: Knex, a: RoleQuery) => Promise<QueryResponse>,

  remove: (k: Knex, a: RoleQuery) => Promise<QueryResponse>,

  move: (k: Knex, a: MoveRoleQuery) => Promise<QueryResponse>,

  removeUserFromAll: (k: Knex, a: UserRoleQuery) => Promise<QueryResponse[]>,

  userHas: (k: Knex, a: RoleQuery) => Promise<boolean>,

  fromUser: (k: Knex, a: UserRoleQuery) => Promise<RoleEnum>,
};
