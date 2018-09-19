import * as Knex from 'knex';
import { difference } from 'ramda';
import { getConfig } from '../../config';
import { getTrx } from '../../tests/utils/database';

describe('DB: Contraint for access_mode in Permission table', () => {
  let trx: Knex.Transaction;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  afterAll(async () => {
    await knex.destroy();
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
  });

  afterEach(async () => {
    await trx.rollback();
  });

  test('all "restricted" permission rows have a corresponding "full" permission row', async () => {
    const restrictedPermissionRows = await knex('access_role_permission')
      .select(['access_role_id', 'permission_id'])
      .where({ access_mode: 'restricted' });

    const fullPermissionRows = await knex('access_role_permission')
      .select(['access_role_id', 'permission_id'])
      .where({ access_mode: 'full' });

    const restrictedWithoutFull = difference(restrictedPermissionRows, fullPermissionRows);

    expect(restrictedWithoutFull).toEqual([]);
  });
});
