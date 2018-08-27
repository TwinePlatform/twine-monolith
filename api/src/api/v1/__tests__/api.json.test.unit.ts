import * as Joi from 'joi';
import { identity as id } from 'ramda';
import { HttpMethodEnum } from '../types';
import { collapseUrls, splitMethodAndUrl } from './utils';
const apiJson = require('../api.json');


const routeSchema = {
  description: Joi.string().required(),
  isImplemented: Joi.boolean().required(),
  auth: Joi.alt([Joi.boolean(), Joi.string()]).required(),
  intendedFor: Joi.array().items(Joi.string()).required(),
  scope: Joi.array().items(Joi.string()).required(),
  query: Joi.alt([Joi.allow(null), Joi.object()]),
  body: Joi.alt([Joi.allow(null), Joi.object()]),
  response: Joi.alt().try(Joi.object(), Joi.string(), Joi.array()).allow(null).required(),
};

const flatRoutes = Object.entries(collapseUrls(apiJson.routes))
  .reduce((acc, [url, route]) => acc.concat({ url, route }), []);

const rx = new RegExp('[-:]');

describe('Api.json structure', () => {
  flatRoutes.forEach(({ url, route }) => {
    describe(`::${url}`, () => {
      const [method] = splitMethodAndUrl(url);

      test('correct keys', () => {
        expect(Object.keys(route)).toEqual([
          'description',
          'isImplemented',
          'auth',
          'intendedFor',
          'scope',
          (method === HttpMethodEnum.GET) ? 'query' : 'body',
          'response',
        ]);
      });

      test('correct values', () => {
        expect(Joi.validate(route, routeSchema).error).toBeNull();

        if (route.auth !== 'external') {
          expect(route.scope
            .map((x: string) => x.split(rx).length === 3)
            .every(id))
          .toBeTruthy();
        }
      });
    });
  });
});
