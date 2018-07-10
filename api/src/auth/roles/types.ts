import * as Knex from 'knex';
import { Role } from '../permissions/types';
import { Dictionary } from 'ramda';

export type QueryResponse = Dictionary<any>;
export type QueryResponseArray = Dictionary<any>[];
export type ExistsQueryResponse = { exists: boolean };

type RolesInterface = {
  add: (a: { role: Role, userId: number, orgId: number }) => Promise<QueryResponse>,
  remove: (a: { role: Role, userId: number, orgId: number }) => Promise<QueryResponse>,
  move : (a: { to: Role, from: Role, userId: number, orgId: number }) => Promise<QueryResponse>,
  removeUserFromAll : (a: { userId: number, orgId: number }) => Promise<QueryResponseArray []>,
  userHas : (a: { role: Role, userId: number, orgId: number }) => Promise<ExistsQueryResponse>,
};

export type RolesInitialiser = (client: Knex) => RolesInterface;
