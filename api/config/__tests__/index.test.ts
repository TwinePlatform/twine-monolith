import { getConfig, validateConfig, Environment, Config } from '..';
import { AppEnum } from '../../src/types/internal';

describe('Config', () => {
  test(`getConfig | ${Environment.DEVELOPMENT}`, () => {
    const config = getConfig(Environment.DEVELOPMENT);

    expect(config.web).toEqual({
      host: 'localhost',
      port: 4000,
      router: { stripTrailingSlash: true },
      routes: {
        cors: {
          origin: [
            'http://localhost:3000', // Visitor App
            'http://localhost:8100', // Volunteer App
            'http://localhost:3100', // Dashboard
            'http://localhost:3200', // Admin App
          ],
          credentials: true,
          additionalExposedHeaders: ['set-cookie'],
        },
        security: {
          hsts: {
            includeSubDomains: true,
            maxAge: 31536000,
            preload: true,
          },
        },
      },
    });
  });

  test(`getConfig | ${Environment.TESTING}`, () => {
    const config = getConfig(Environment.TESTING);

    expect(config.web).toEqual({
      host: 'localhost',
      port: 4001,
      router: { stripTrailingSlash: true },
      routes: {
        cors: {
          origin: ['http://localhost:3000'],
          credentials: true,
          additionalExposedHeaders: ['set-cookie'],
        },
        security: {
          hsts: {
            includeSubDomains: true,
            maxAge: 31536000,
            preload: true,
          },
        },
      },
    });
  });

  test(`getConfig | ${Environment.PRODUCTION}`, () => {
    const config = getConfig(Environment.PRODUCTION);

    expect(config.web).toEqual({
      host: '0.0.0.0',
      port: 4002,
      router: { stripTrailingSlash: true },
      routes: {
        cors: {
          origin: [
            'https://admin.twine-together.com',
            'https://visitor.twine-together.com',
            'https://data.twine-toghether.com',
          ],
          credentials: true,
          additionalExposedHeaders: ['set-cookie'],
        },
        security: {
          hsts: {
            includeSubDomains: true,
            maxAge: 31536000,
            preload: true,
          },
        },
      },
    });
  });

  test('getConfig | Invalid environment throws', () => {
    expect(() => getConfig('foo')).toThrow('Invalid environment: foo');
  });

  test('Config | validateConfig | valid config', () => {
    const cfg: Config = {
      root: __dirname,
      env: Environment.DEVELOPMENT,
      web: {
        host: 'localhost',
        port: 1000,
        router: { stripTrailingSlash: true },
        routes: {
          cors: {
            origin: ['http://localhost:3000'],
            credentials: true,
            additionalExposedHeaders: ['set-cookie'],
          },
          security: false,
        },
      },
      platform: {
        domains: {
          [AppEnum.ADMIN]: 'localhost:5000',
          [AppEnum.DASHBOARD]: 'localhost:3000',
          [AppEnum.TWINE_API]: 'localhost:4000',
          [AppEnum.VISITOR]: 'localhost:3000',
          [AppEnum.VOLUNTEER]: null,
        },
      },
      cache: {
        session: {
          name: 'session',
          options: {
            url: 'redis://localhost:6379',
          },
        },
      },
      knex: {
        client: 'pg',
        connection: {
          host: 'localhost',
          port: 5432,
          database: 'postgres',
          user: 'foo',
        },
        migrations: {
          tableName: 'thisplace',
          directory: 'here',
        },
        seeds: {
          directory: 'where',
        },
      },
      email: {
        postmarkKey: 'foo',
        fromAddress: 'boo@coo.com',
        developers: ['boo@coo.com', 'hi@yo.com'],
      },
      auth: {
        schema: {
          session_cookie: {
            options: {
              name: 'wpppp',
              cookieOptions: {
                password: 'rt49089y5h3j9u0894thugirbv90u8r9g7tu4fevu9rguib2fwe',
              },
            },
          },
        },
      },
      qrcode: {
        secret: 'wftg4yj93g0irwfone49t2jwfeefwrgeijot3efwrtnjkbh',
      },
    };

    expect(() => validateConfig(cfg)).not.toThrow();
  });

  test('Config | validateConfig | invalid config', () => {
    const cfg: Config = {
      root: '',
      env: Environment.DEVELOPMENT,
      web: {
        host: 'localhost',
        port: -1,
        router: null,
        routes: {
          cors: {
            origin: ['http://lost.com'],
            credentials: true,
            additionalExposedHeaders: ['set-cookie'],
          },
          security: false,
        },
      },
      platform: {
        domains: {
          [AppEnum.ADMIN]: 'localhost:5000',
          [AppEnum.DASHBOARD]: 'localhost:3000',
          [AppEnum.TWINE_API]: 'localhost:4000',
          [AppEnum.VISITOR]: 'localhost:3000',
          [AppEnum.VOLUNTEER]: null,
        },
      },
      cache: {
        session: {
          name: 'session',
          options: {
            url: 'redis://localhost:6379',
          },
        },
      },
      knex: {
        connection: {
          host: 'localhost',
          port: 5432,
          database: 'postgres',
          user: 'foo',
        },
      },
      email: {
        postmarkKey: '',
        fromAddress: 'fooo',
        developers: ['boo@coo.com', 'hi@yo.com'],
      },
      auth: {
        schema: {
          session_cookie: {
            options: {
              name: 'fooo',
              cookieOptions: {
                password: 'rt49089y5h3j9u0894thugirbv90u8r9g7tu4fevu9rguib2fwe',
              },
            },
          },
        },
      },
      qrcode: {
        secret: 'wftg4yj93g0irwfone49t2jwfeefwrgeijot3efwrtnjkbh',
      },
    };

    expect(() => validateConfig(cfg)).toThrow();
  });

});
