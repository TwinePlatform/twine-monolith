import * as Hapi from '@hapi/hapi';
import { init } from '../../../../../../tests/utils/server';
import { getConfig } from '../../../../../../config';
import { Organisations, Organisation, User, Users } from '../../../../../models';
import { Credentials as StandardCredentials } from '../../../../../auth/strategies/standard';
import { injectCfg } from '../../../../../../tests/utils/inject';


describe('POST /v1/visitor/search', () => {
  let server: Hapi.Server;
  let user: User;
  let organisation: Organisation;
  let credentials: Hapi.AuthCredentials;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    organisation = await Organisations.getOne(
      server.app.knex,
      { where: { name: 'Aperture Science' } }
    );
    user = await Users.getOne(server.app.knex, { where: { name: 'GlaDos' } });
    credentials = await StandardCredentials.create(server.app.knex, user, organisation);
  });

  afterAll(async () => {
    server.shutdown(true);
  });

  test('Find visitor using valid QR code hash', async () => {
    const res = await server.inject(injectCfg({
      method: 'POST',
      url: '/v1/users/visitors/search',
      payload: {
        qrCode: 'chellsqrcode',
      },
      credentials,
    }));

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toEqual(expect.objectContaining({ name: 'Chell' }));
  });

  test('Fail to find visitor using invalid QR code hash', async () => {
    const res = await server.inject(injectCfg({
      method: 'POST',
      url: '/v1/users/visitors/search',
      payload: {
        qrCode: 'definitely invalid qrCode',
      },
      credentials,
    }));

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toEqual(null);
  });
});
