import * as Knex from 'knex';
import { Dictionary } from '../../utils/types'

type Role = 
  'VISITOR'
  | 'VOLUNTEER'
  | 'VOLUNTEER_ADMIN'
  | 'ORG_ADMIN'
  | 'TWINE_ADMIN'
  | 'SYS_ADMIN';

type Access = 
  'read'
  | 'write'
  | 'delete';

type Resource =
  'constants'
  | 'organisations_details'
  | 'organisations_subscriptions'
  | 'organisations_feedback'
  | 'organisations_training'
  | 'organisations_invitations'
  | 'organisations_outreach'
  | 'users_details'
  | 'volunteer_activities'
  | 'volunteer_logs'
  | 'visit_activites'
  | 'visit_logs'

type PermissionLevel =
  'own'
  | 'child'
  | 'parent'
  | 'any'


type ProductionConnection = {
  host: string,
  port: number,
  database: string,
  user: string,
  password?: string,
  ssl: boolean,
}

type DevelopmentConnection = string

type ReturningQueryResponse = Error | Dictionary<any>
type ExistsQueryResponse = { exists: boolean }
 
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
}) => Knex.QueryBuilder

export type GetRoleId =
(a: {
  client: Knex,
  role: Role, 
}) => Promise<string> //this should be number, potentially a problem with Knex types
