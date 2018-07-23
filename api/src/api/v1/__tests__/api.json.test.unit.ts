const apiJson = require('../api.json');
import { identity as id } from 'ramda';

const flatRoutes = Object.entries(apiJson.routes)
  .reduce((acc, [resource, routes]) => {
    const flatRoutes = Object.entries(routes)
      .reduce((acc2, [endpoint, routeObjectsWithMethod]) => {
        const flatRouteObjectsWithMedod = Object.entries(routeObjectsWithMethod)
          .reduce((acc3, [method, routeObject]) => {
            const flatRoute = {
              path: `${resource}${endpoint}`,
              method: `${method}`,
              route: routeObject,
            };
            return [...acc3, flatRoute];
          }, []);
        return [...acc2, ...flatRouteObjectsWithMedod];
      }, []);
    return [...acc, ...flatRoutes];
  }, []);

const rx = new RegExp('[-:]');

describe('Api.json structure', () => {
  flatRoutes.forEach(({ path, method, route }) => {
    describe(`::${method} ${path}`, () => {
      const requestType = (method === 'GET')
        ? 'query'
        : 'body';
      test('correct keys', () => {
        expect(Object.keys(route)).toEqual([
          'description',
          'isImplemented',
          'auth',
          'intendedFor',
          'scope',
          requestType,
          'response']);
      });

      test('correct values', () => {
        expect(typeof route.description).toEqual('string');
        expect(typeof route.isImplemented).toEqual('boolean');
        expect(typeof route.auth).toEqual('boolean');
        expect(Array.isArray(route.intendedFor)).toBeTruthy();
        expect(route.intendedFor
            .map((x: string) => typeof x === 'string')
            .every(id))
          .toBeTruthy();
        expect(Array.isArray(route.scope)).toBeTruthy();
        expect(route.scope
            .map((x: string) => x.split(rx).length === 3)
            .every(id))
          .toBeTruthy();
        expect(typeof route[requestType]).toEqual('object');
        expect(typeof route.response === 'object' || 'string').toBeTruthy();
      });
    });
  });
});
