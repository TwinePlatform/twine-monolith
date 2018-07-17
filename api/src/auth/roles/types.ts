import * as Knex from 'knex';
import { Role } from '../permissions/types';
import { Dictionary } from 'ramda';

export type QueryResponse = Dictionary<any>;
export type ExistsQueryResponse = { exists: boolean };

type RolesInterface = {
  add: (a: { role: Role, userId: number, organisationId: number }) =>
    Promise<QueryResponse>,

  remove: (a: { role: Role, userId: number, organisationId: number }) =>
    Promise<QueryResponse>,

  move: (a: { to: Role, from: Role, userId: number, organisationId: number }) =>
    Promise<QueryResponse>,

  removeUserFromAll: (a: { userId: number, organisationId: number }) =>
    Promise<QueryResponse []>,

  userHas: (a: { role: Role, userId: number, organisationId: number }) =>
    Promise<ExistsQueryResponse>,
  getUserRole: (a: { userId: number, organisationId: number}) => Promise<QueryResponse>,
};

export type RolesInitialiser = (client: Knex) => RolesInterface;
