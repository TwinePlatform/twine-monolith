import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../models';
import { StandardCredentials } from '../../../../auth/strategies/standard';
import { getTrx } from '../../../../../tests/utils/database';


describe('API HOOK - on pre response', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;

  let user: User;
  let organisation: Organisation;
  let credentials: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;

    user = await Users.getOne(knex, { where: { name: 'GlaDos' } });
    organisation = await Organisations.getOne(knex, { where: { id: 1 } });
    credentials = await StandardCredentials.get(knex, user, organisation);
  });


  beforeEach(async () => {
    trx = await getTrx(knex);
    server.app.knex = trx;
  });

  afterEach(async () => {
    await trx.rollback();
    server.app.knex = knex;
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  describe('Add active day event', () => {
    test('SUCCESS :: one request creates one event', async () => {

      // check no event exists
      const eventCheck = await trx('user_account_active_day')
        .where({ user_account_id: credentials.user.user.id })
        .andWhereRaw('created_at >= DATE_TRUNC(\'day\', CURRENT_DATE)');

      expect(eventCheck).toHaveLength(0);

      await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visitors',
        credentials,
        headers: {
          origin: 'test:0000',
        },
      });

      // TODO: replace set timeout
      await new Promise((resolve) => setTimeout(resolve, 100));

      // check event is inserted
      const eventCheck2 = await trx('user_account_active_day')
        .where({ user_account_id: credentials.user.user.id })
        .andWhereRaw('created_at >= DATE_TRUNC(\'day\', CURRENT_DATE)');

      expect(eventCheck2).toHaveLength(1);
      expect(eventCheck2).toEqual([expect.objectContaining({
        user_account_id: 2,
        origin: 'test:0000',
      })]);
    });

    test('SUCCESS :: two requests creates one event', async () => {

      // check no event exists
      const eventCheck = await trx('user_account_active_day')
        .where({ user_account_id: credentials.user.user.id })
        .andWhereRaw('created_at >= DATE_TRUNC(\'day\', CURRENT_DATE)');

      expect(eventCheck).toHaveLength(0);

      await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visitors',
        credentials,
        headers: {
          origin: 'test:0000',
        },
      });

      await server.inject({
        method: 'GET',
        url: '/v1/community-businesses/me/visitors',
        credentials,
        headers: {
          origin: 'test:0000',
        },
      });

      // check event is inserted
      const eventCheck2 = await trx('user_account_active_day')
        .where({ user_account_id: credentials.user.user.id })
        .andWhereRaw('created_at >= DATE_TRUNC(\'day\', CURRENT_DATE)');

      expect(eventCheck2).toHaveLength(1);
      expect(eventCheck2).toEqual([expect.objectContaining({
        user_account_id: 2,
        origin: 'test:0000',
      })]);
    });
  });
});
