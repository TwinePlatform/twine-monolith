import * as Hapi from '@hapi/hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { User, Users, Organisation, Organisations } from '../../../../../models';
import { Credentials as StandardCredentials } from '../../../../../auth/strategies/standard';
import { injectCfg } from '../../../../../../tests/utils/inject';


describe('API /community-businesses/{id}/visitors', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let user: User;
  let organisation: Organisation;
  let credentials: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);
  const mockVisitorReminder = jest.fn();

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;
    server.app.EmailService.visitorReminder = mockVisitorReminder;

    user = await Users.getOne(knex, { where: { name: 'GlaDos' } });
    organisation = await Organisations.getOne(knex, { where: { id: 1 } });
    credentials = await StandardCredentials.get(knex, user, organisation);

  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  beforeEach(() => {
    mockVisitorReminder.mockClear();
  });

  test('send e-mail w/ qr code attached to visitor of own community business', async () => {
    mockVisitorReminder.mockReturnValueOnce(Promise.resolve());

    const res = await server.inject(injectCfg({
      method: 'POST',
      url: '/v1/community-businesses/me/visitors/1/emails',
      payload: {
        type: 'qrcode',
      },
      credentials,
    }));

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual({ result: null });
    expect(mockVisitorReminder).toHaveBeenCalledTimes(1);
  });

  test('return 502 when E-mail service is unavailable', async () => {
    mockVisitorReminder.mockRejectedValueOnce(null);

    const res = await server.inject(injectCfg({
      method: 'POST',
      url: '/v1/community-businesses/me/visitors/1/emails',
      payload: {
        type: 'qrcode',
      },
      credentials,
    }));

    expect(res.statusCode).toBe(502);
    expect(mockVisitorReminder).toHaveBeenCalledTimes(1);
  });

  test('return 403 for non-child visitor', async () => {
    const res = await server.inject(injectCfg({
      method: 'POST',
      url: '/v1/community-businesses/me/visitors/4/emails',
      payload: {
        type: 'qrcode',
      },
      credentials,
    }));

    expect(res.statusCode).toBe(403);
  });

  test('return 400 for unsupported email type', async () => {
    const res = await server.inject(injectCfg({
      method: 'POST',
      url: '/v1/community-businesses/me/visitors/1/emails',
      payload: {
        type: 'unknownemailtype',
      },
      credentials,
    }));

    expect(res.statusCode).toBe(400);
  });

  test('return 400 for user with no email', async () => {
    const res = await server.inject(injectCfg({
      method: 'POST',
      url: '/v1/community-businesses/me/visitors/9/emails',
      payload: {
        type: 'qrcode',
      },
      credentials,
    }));

    expect(res.statusCode).toBe(400);
    expect((<any> res).result.error.message).toBe('User has not specified an email');
  });

  test('return 400 for anonymous user', async () => {
    await Users.update(knex, { name: 'Companion Cube' }, { email: 'anon_01_org_01' });
    const res = await server.inject(injectCfg({
      method: 'POST',
      url: '/v1/community-businesses/me/visitors/9/emails',
      payload: {
        type: 'qrcode',
      },
      credentials,
    }));

    expect(res.statusCode).toBe(400);
    expect((<any> res).result.error.message).toBe('User has not specified an email');
  });


});
