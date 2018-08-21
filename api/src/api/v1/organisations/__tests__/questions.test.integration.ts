import * as Hapi from 'hapi';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';


describe('API v1 :: Organisations :: Questions', () => {
  let server: Hapi.Server;
  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  test('CLS benchmarks :: use DB ID', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/v1/organisations/1/questions/g/cls',
      credentials: { scope: ['frontline'] },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).data)
      .toEqual({ region: 'London', mean_score: 2.001 });
  });

  test('CLS benchmarks :: use 360 Giving ID', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/v1/organisations/GB-COH-3205/questions/bf/cls',
      credentials: { scope: ['frontline'] },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).data)
      .toEqual({ region: 'London', mean_score: 6.935 });
  });

  test('NPS benchmarks :: use DB ID', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/v1/organisations/1/questions/e/cls',
      credentials: { scope: ['frontline'] },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).data).toEqual({
      score: {
        detractors: { range: [0, 6], percentage: 0.24 },
        passives: { range: [7, 8], percentage: 0.21 },
        promoters: { range: [9, 10], percentage: 0.55 },
      },
    });
  });

  test('NPS benchmarks :: use 360 Giving ID', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/v1/organisations/GB-COH-3205/questions/e/cls',
      credentials: { scope: ['frontline'] },
    });

    expect(res.statusCode).toBe(200);
    expect((<any> res.result).data).toEqual({
      score: {
        detractors: { range: [0, 6], percentage: 0.24 },
        passives: { range: [7, 8], percentage: 0.21 },
        promoters: { range: [9, 10], percentage: 0.55 },
      },
    });
  });
});
