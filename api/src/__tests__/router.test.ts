import * as Hapi from 'hapi';
import { init } from '../server';
import { getConfig } from '../../config';
const apiJson = require('../api/v1/api.json');

type HttpMethod =
  'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE';

type RouteTestFixture = {
  testName: string,
  url: string,
  method: HttpMethod,
  statusCode: number,
};

const routeTestFixtures: RouteTestFixture [] = Object.keys(apiJson.routes)
  .reduce((acc, resource) => {
    const fullRoute = Object.entries(apiJson.routes[resource])
      .reduce((nestedAcc, [nestedRoute, methods]) => {
        const testObj = Object.entries(methods)
        .map(([method, routesProps]) => {
          const url = (resource + nestedRoute).replace(':id', '1');
          const statusCode = routesProps.isImplemented
            ? 200
            : 404;
          return {
            testName: `${method} ${url}`,
            url,
            method,
            statusCode,
          };
        });
        return [... nestedAcc, ...testObj];
      }, []);
    return [...acc, ...fullRoute];
  }, []);

describe('API Specification', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await init(getConfig(process.env.NODE_ENV));
  });

  routeTestFixtures.forEach(({ testName, method, url, statusCode }) => {
    test(testName, async () => {
      const response = await server.inject({ method, url });
      expect(response.statusCode).toBe(statusCode);
    });
  });
});
