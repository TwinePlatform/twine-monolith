import * as Knex from 'knex';
import * as Redis from 'ioredis';
import { delay } from 'twine-util/time';
import { getConfig } from '../../../../../config';
import { createListener } from '../monitoring';
import { UserSessionRecords } from '../../../../models/user_session_record';
import { Users, Organisations } from '../../../../models';

describe('REDIS', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  test('TEST', async () => {
    const client = new Redis(config.cache.session.options.url);
    const sid = 'foo';
    const user = await Users.getOne(knex, { where: { id: 1 } });
    const org = await Organisations.fromUser(knex, { where: user });

    UserSessionRecords.initSession(knex, user, org, sid);

    const listener = createListener(knex, config.cache.session.options.url);

    try {
      await client.set('foo', 1);
      await client.pexpire('foo', 100);
      await delay(500);

    } catch (error) {
      console.log(error);

    }

    const results = await knex('user_session_record').select('*');

    expect(results).toEqual([
      {
        created_at: new Date('2019-08-09T23:30:04.104Z'),
        deleted_at: null,
        ended_at: null,
        modified_at: null,
        organisation_id: 1,
        referrers: [],
        session_end_type: 'expired',
        session_id: 'foo',
        started_at: new Date('2019-08-09T23:30:04.101Z'),
        user_account_id: 1,
        user_session_record_id: 1,
      },
    ]);

    await listener.disconnect();
  });
});
