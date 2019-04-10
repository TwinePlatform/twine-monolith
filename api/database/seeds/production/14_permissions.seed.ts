import * as Knex from 'knex';
import { permissionRows } from '../../utils';

exports.seed = (knex: Knex) =>
  knex('permission')
    .insert(permissionRows);
