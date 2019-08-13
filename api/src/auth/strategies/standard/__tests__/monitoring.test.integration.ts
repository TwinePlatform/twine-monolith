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

  afterAll(async () => {
    await knex.destroy();
  });

  test('TEST', async () => {
    const client = new Redis(config.cache.session.options.url);
    const sid = 'foo';
    const user = await Users.getOne(knex, { where: { id: 1 } });
    const org = await Organisations.fromUser(knex, { where: user });

    const resultBefore = await UserSessionRecords.initSession(knex, user, org, sid);

    const listener = createListener(knex, config.cache.session.options.url);

    await client.set(sid, 2);
    await client.pexpire(sid, 1);
    await delay(100);

    const resultAfter = await knex('user_session_record').select('*');

    // Clean up first in case assertions fail
    await listener.quit();
    await client.quit();

    expect(resultAfter).toHaveLength(1);
    expect(resultAfter[0].modified_at).not.toBe(null);
    expect(resultAfter[0].session_end_type).toBe('expired');
    expect(resultBefore).toEqual({
      id: resultAfter[0].user_session_record_id,
      sessionId: resultAfter[0].session_id,
      userId: resultAfter[0].user_account_id,
      organisationId: resultAfter[0].organisation_id,
      startedAt: resultAfter[0].started_at,
      createdAt: resultAfter[0].created_at,
      referrers: resultAfter[0].referrers,
    });
  });
});
