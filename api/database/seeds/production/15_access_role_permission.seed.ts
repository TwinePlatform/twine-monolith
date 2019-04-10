import * as Knex from 'knex';
import { accessRolePermissionsRows } from '../../utils';

exports.seed = (knex: Knex) =>
  knex('access_role_permission')
    .insert(accessRolePermissionsRows(knex));
