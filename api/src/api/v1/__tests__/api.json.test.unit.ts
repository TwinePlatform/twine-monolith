const apiJson = require('../api.json');
import { identity as id } from 'ramda';
import * as Joi from 'joi';

const routeSchema = {
  description: Joi.string().required(),
  isImplemented: Joi.boolean().required(),
  auth: Joi.boolean().required(),
  intendedFor: Joi.array().items(Joi.string()).required(),
  scope : Joi.array().items(Joi.string()).required(),
  query : Joi.object(),
  body : Joi.object(),
  response : Joi.alternatives().try(Joi.object(), Joi.string(), Joi.array()).allow(null).required(),
};

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
        expect(Joi.validate(route, routeSchema).error).toBeNull();
        expect(route.scope
            .map((x: string) => x.split(rx).length === 3)
            .every(id))
          .toBeTruthy();
      });
    });
  });
});
