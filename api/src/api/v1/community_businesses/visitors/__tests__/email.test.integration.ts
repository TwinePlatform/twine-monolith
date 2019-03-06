import * as Hapi from 'hapi';
import * as Knex from 'knex';
import * as Postmark from 'postmark';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../../models';
import { EmailTemplate } from '../../../../../services/email/templates';
import { StandardCredentials } from '../../../../../auth/strategies/standard';


describe('API /community-businesses/{id}/visitors', () => {
  let server: Hapi.Server;
  let knex: Knex;
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

  afterAll(async () => {
    await server.shutdown(true);
  });

  test('send e-mail w/ qr code attached to visitor of own community business', async () => {
    // Attach mock
    const realEmailServiceSend = server.app.EmailService.send;
    const mock = jest.fn(() => Promise.resolve({} as Postmark.Models.MessageSendingResponse));
    server.app.EmailService.send = mock;

    const res = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/me/visitors/1/emails',
      payload: {
        type: 'qrcode',
      },
      credentials,
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual({ result: null });
    expect(mock).toHaveBeenCalledTimes(1);
    expect((<any> mock.mock.calls[0])[0]).toEqual(expect.objectContaining({
      to: '1498@aperturescience.com',
      templateId: EmailTemplate.VISITOR_WELCOME,
      templateModel: { name: 'Chell', organisation: 'Aperture Science' },
      attachments: [
        expect.objectContaining({
          contentType: 'application/octet-stream',
        }),
      ],
    }));

    // Reset mock
    server.app.EmailService.send = realEmailServiceSend;
  });

  test('return 502 when E-mail service is unavailable', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/me/visitors/1/emails',
      payload: {
        type: 'qrcode',
      },
      credentials,
    });

    expect(res.statusCode).toBe(502);
  });

  test('return 403 for non-child visitor', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/me/visitors/4/emails',
      payload: {
        type: 'qrcode',
      },
      credentials,
    });

    expect(res.statusCode).toBe(403);
  });

  test('return 400 for unsupported email type', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/me/visitors/1/emails',
      payload: {
        type: 'unknownemailtype',
      },
      credentials,
    });

    expect(res.statusCode).toBe(400);
  });

  test('return 400 for user with no email', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/me/visitors/9/emails',
      payload: {
        type: 'qrcode',
      },
      credentials,
    });

    expect(res.statusCode).toBe(400);
    expect((<any> res).result.error.message).toBe('User has not specified an email');
  });

  test('return 400 for anonymous user', async () => {
    await Users.update(knex, { name: 'Companion Cube' }, { email: 'anon_01_org_01' });
    const res = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/me/visitors/9/emails',
      payload: {
        type: 'qrcode',
      },
      credentials,
    });

    expect(res.statusCode).toBe(400);
    expect((<any> res).result.error.message).toBe('User has not specified an email');
  });


});
