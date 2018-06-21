import { server } from '../server';
const apiJson = require('../../docs/api.json');

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
      },      []);
    return [...acc, ...fullRoute];
  },      []);

describe('API Specification', () => {
  routeTestFixtures.forEach((fixture) => {
    test(fixture.testName, async () => {
      const response = await server.inject({
        method: fixture.method,
        url: fixture.url,
      });
      expect(response.statusCode).toBe(fixture.statusCode);
    });
  });
});
