import * as Knex from 'knex';

type Dictionary<T> = { [k: string]: T };

export enum Role {
  VISITOR = 'VISITOR',
  VOLUNTEER = 'VOLUNTEER',
  VOLUNTEER_ADMIN = 'VOLUNTEER_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  TWINE_ADMIN = 'TWINE_ADMIN',
  SYS_ADMIN = 'SYS_ADMIN',
}

export enum Access {
  READ = 'read',
  WRITE = 'write',
  DEETE = 'delete',
}

export enum Resource {
  CONSTANTS = 'constants',
  ORG_DETAILS = 'organisations_details',
  ORG_SUBSCRIPTIONS =  'organisations_subscriptions',
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

export enum PermissionLevel {
  OWN = 'own',
  CHILD = 'child',
  PARENT = 'parent',
}

type ReturningQueryResponse = Error | Dictionary<any>;
type ExistsQueryResponse = { exists: boolean };

export type PermissionsInitialiser = (client: Knex) => {
  grantExisting: (a: {
    resource: Resource,
    permissionLevel: PermissionLevel,
    access: Access,
    role: Role
  }) => Promise<ReturningQueryResponse>,
  grantNew: (a: {
    resource: Resource,
    permissionLevel: PermissionLevel,
    access: Access,
    role: Role
  }) => Promise<ReturningQueryResponse>,
  revoke: (a: {
    resource: Resource,
    permissionLevel: PermissionLevel,
    access: Access,
    role: Role
  }) => Promise<ReturningQueryResponse>,
  // grantAll: (a: {resource: Resource, role: Role}) => {},
  // revokeAll: (a: {resource: Resource, role: Role}) => {},
  roleHas: (a: {
    resource: Resource,
    permissionLevel: PermissionLevel,
    access: Access,
    role: Role
  }) => Promise<ExistsQueryResponse>,
  userHas: (a: {
    userId: number,
    resource: Resource,
    permissionLevel: PermissionLevel,
    access: Access,
  }) => Promise<ExistsQueryResponse>,
};

export type GetPermissionIds =
(a: {
  client: Knex,
  resource: Resource,
  permissionLevel: PermissionLevel,
  access: Access,
}) => Knex.QueryBuilder;

export type GetRoleId =
(a: {
  client: Knex,
  role: Role,
}) => Promise<string>; // this should be number, potentially a problem with Knex types
