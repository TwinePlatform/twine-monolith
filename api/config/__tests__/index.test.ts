import { getConfig, validateConfig, Environment, Config } from '..';

describe('Config', () => {
  test(`getConfig | ${Environment.DEVELOPMENT}`, () => {
    const config = getConfig(Environment.DEVELOPMENT);

    expect(config.web).toEqual({
      host: 'localhost',
      port: 4000,
      router: { stripTrailingSlash: true },
      routes: {
        cors: {
          origin: ['http://localhost:3000', 'http://localhost:8100', 'http://localhost:5000'],
          credentials: true,
          additionalExposedHeaders: ['set-cookie'],
        },
        security: {
          hsts: {
            includeSubdomains: true,
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
            includeSubdomains: true,
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
          origin: ['https://visitor.twine-together.com'],
          credentials: true,
          additionalExposedHeaders: ['set-cookie'],
        },
        security: {
          hsts: {
            includeSubdomains: true,
            maxAge: 31536000,
            preload: true,
          },
        },
      },
    });

  });

  test(`getConfig | Invalid environment defaults to ${Environment.DEVELOPMENT}`, () => {
    const config = getConfig('foo');

    expect(config.web).toEqual({
      host: 'localhost',
      port: 4000,
      router: { stripTrailingSlash: true },
      routes: {
        cors: {
          origin: ['http://localhost:3000', 'http://localhost:8100', 'http://localhost:5000'],
          credentials: true,
          additionalExposedHeaders: ['set-cookie'],
        },
        security: {
          hsts: {
            includeSubdomains: true,
            maxAge: 31536000,
            preload: true,
          },
        },
      },
    });
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
        postmark_key: 'foo',
      },
      auth: {
        standard: {
          jwt: {
            secret: 'lol',
          },
          cookie: {
            name: 'foo',
            options : {
              ttl: 24 * 60 * 60 * 1000,
              isSecure: true,
              isHttpOnly: true,
              isSameSite: 'Lax',
              path: '/',
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
      knex: {
        connection: {
          host: 'localhost',
          port: 5432,
          database: 'postgres',
          user: 'foo',
        },
      },
      email: {
        postmark_key: '',
      },
      auth: {
        standard: {
          jwt: {
            secret: '',
          },
          cookie: {
            name: '',
            options: {
              ttl: 24 * 60 * 60 * 1000,
              isSecure: true,
              isHttpOnly: true,
              isSameSite: 'Lax',
              path: '/',
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
