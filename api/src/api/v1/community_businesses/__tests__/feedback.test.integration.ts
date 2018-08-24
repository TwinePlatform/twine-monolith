import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { Users, Organisations } from '../../../../models';


describe('POST /community-businesses/{id}/feedback', () => {
  let server: Hapi.Server;
  let knex: Knex;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  test('Leave feedback on own org as ORG_ADMIN', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/me/feedback',
      payload: { feedbackScore: 1 },
      credentials: {
        user: await Users.getOne(knex, { where: { name: 'Gordon' } }),
        organisation: await Organisations.getOne(knex, { where: { name: 'Black Mesa Research' } }),
        scope: ['organisations_feedback-child:write'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual(expect.objectContaining({
      result: {
        id: 1,
        score: 1,
        organisationId: 2,
      },
    }));
  });
});
