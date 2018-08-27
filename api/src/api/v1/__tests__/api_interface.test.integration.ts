import * as Hapi from 'hapi';
import { init } from '../../../server';
import { getConfig } from '../../../../config';
import factory from '../../../../tests/utils/factory';
import { collapseUrls, splitMethodAndUrl } from './utils';
import { RouteTestFixture, HttpMethodEnum } from '../types';
import { RoleEnum } from '../../../auth/types';
const APISpecification = require('../api.json');

const dummyUsers: any[] = [];
const dummyOrgs: any[] = [];
(async () => {
  dummyUsers.push(await factory.build('user'));
})();
(async () => {
  dummyOrgs.push(await factory.build('organisation'));
})();

const createNotFoundTest = (method: HttpMethodEnum, url: string) => ({
  name: `${method} ${url} || Not found`,
  inject: { method, url },
  expect: {
    statusCode: 404,
    payload: { error: { statusCode: 404, type: 'Not Found', message: 'Not Found' } },
  },
});

const createUnauthenticatedTest = (method: HttpMethodEnum, url: string) => ({
  name: `${method} ${url} || Unauthenticated`,
  inject: { method, url },
  expect: {
    statusCode: 401,
    payload: {
      error: { statusCode: 401, type: 'Unauthorized', message: 'Missing authentication' },
    },
  },
});

const createUnauthorisedTest = (method: HttpMethodEnum, url: string) => ({
  name: `${method} ${url} || Unauthorised`,
  inject: {
    method,
    url,
    credentials: { scope: [''], user: dummyUsers[0], role: RoleEnum.VOLUNTEER },
  },
  expect: {
    statusCode: 403,
    payload: { error: { statusCode: 403, type: 'Forbidden', message: 'Insufficient scope' } },
  },
});

const testSpec = Object.entries(collapseUrls(APISpecification.routes, '/v1'))
  .filter(([, routeSpec]) => routeSpec.isImplemented)
  .map(([endpoint, routeSpec]): [string, RouteTestFixture[]] => {
    const [method, url] = splitMethodAndUrl(endpoint);
    const tests: RouteTestFixture[] = [];

    /*
     * Not found tests
     */
    if (!routeSpec.isImplemented) {
      const tests = [createNotFoundTest(method, url)];
      return [`${method} ${endpoint}`, tests];
    }

    /*
     * Authentication tests
     */
    if (routeSpec.auth) {
      tests.push(createUnauthenticatedTest(method, url));
    }

    if (routeSpec.scope && routeSpec.scope.length > 0) {
      tests.push(createUnauthorisedTest(method, url));
    }

    /*
     * Bad request tests
     */
    if (routeSpec.query !== null) {
      tests.push({
        name: `${method} ${url} || Bad query parameters || unrecognised query parameter`,
        inject: {
          method,
          url: url.concat('?fakeQueryParam=foo'),
          credentials: {
            scope: routeSpec.scope[0],
            role: RoleEnum.TWINE_ADMIN,
            user: dummyUsers[0],
            organisation: dummyOrgs[0],
          },
        },
        expect: { statusCode: 400 },
      });
      tests.push({
        name: `${method} ${url} || Bad query parameters || invalid query parameter value`,
        inject: {
          method,
          url: url.concat('?limit=foo&fields=1'),
          credentials: {
            scope: routeSpec.scope[0],
            role: RoleEnum.TWINE_ADMIN,
            user: dummyUsers[0],
            organisation: dummyOrgs[0],
          },
        },
        expect: { statusCode: 400 },
      });
    }

    if (routeSpec.body) {
      // Only clearly erroneous payload keys are tested here.
      // More specific payload validation violations should be covered
      // in functional tests
      tests.push({
        name: `${method} ${url} || Bad query parameters || unrecognised request body parameter`,
        inject: {
          method,
          url,
          credentials: {
            scope: routeSpec.scope[0],
            role: RoleEnum.TWINE_ADMIN,
            user: dummyUsers[0],
            organisation: dummyOrgs[0],
          },
          payload: { thisKeyWillNeverExistInTheSpec: 'foo' },
        },
        expect: { statusCode: 400 },
      });
    }

    // TODO:
    // No modifiers, full response
    // Fields query, pagination, partial response
    // Filter query, partial response

    return [`${method} ${endpoint}`, tests];
  });


describe('API Specification', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = await init(getConfig(process.env.NODE_ENV));
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  testSpec.forEach(([endpoint, routeTestSpecs]) => {
    routeTestSpecs.forEach((spec) => {
      test(spec.name, async () => {
        /*
         * Setup
         */
        if (spec.setup) {
          await spec.setup(server);
        }

        /*
         * Act
         */
        const result = await server.inject(spec.inject);

        /*
         * Assert
         */
        expect(result.statusCode).toBe(spec.expect.statusCode);

        if (typeof spec.expect.payload === 'function') {
          spec.expect.payload(result.result);

        } else if (spec.expect.payload) {
          expect(result.result).toEqual(spec.expect.payload);

        }

        /*
         * Teardown
         */
        if (spec.teardown) {
          await spec.teardown(server);
        }
      });
    });
  });
});
