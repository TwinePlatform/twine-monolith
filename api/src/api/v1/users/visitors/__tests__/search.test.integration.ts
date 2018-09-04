import * as Hapi from 'hapi';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { Organisations, Organisation } from '../../../../../models';


describe('POST /v1/visitor/search', () => {
  let server: Hapi.Server;
  let organisation: Organisation;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    organisation = await Organisations.getOne(
      server.app.knex,
      { where: { name: 'Aperture Science' } }
    );
  });

  afterAll(async () => {
    server.shutdown(true);
  });

  test('Find visitor using valid QR code hash', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/visitors/search',
      payload: {
        qrCode: 'tobereplacedwhenqrgenissetup',
      },
      credentials: {
        scope: ['user_details-child:read'],
        organisation,
      },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toEqual(expect.objectContaining({ name: 'Chell' }));
  });

  test('Fail to find visitor using invalid QR code hash', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/v1/users/visitors/search',
      payload: {
        qrCode: 'definitely invalid qrCode',
      },
      credentials: {
        scope: ['user_details-child:read'],
        organisation,
      },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).result).toEqual(null);
  });
});
