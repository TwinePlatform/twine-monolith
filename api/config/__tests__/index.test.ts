import { readConfig, validateConfig, Environment, Config } from '..';

describe('Config', () => {
  test(`readConfig | ${Environment.DEVELOPMENT}`, () => {
    const config = readConfig(Environment.DEVELOPMENT);

    expect(config.web).toEqual({ port: 4000, host: 'localhost', tls: null });
  });

  test(`readConfig | ${Environment.TESTING}`, () => {
    const config = readConfig(Environment.TESTING);

    expect(config.web).toEqual({ port: 4001, host: 'localhost', tls: null });
  });

  test(`readConfig | ${Environment.PRODUCTION}`, () => {
    const config = readConfig(Environment.PRODUCTION);

    expect(config.web).toEqual({ port: 4002, host: '0.0.0.0', tls: null });
  });

  test('Config | validateConfig | valid config', () => {
    const cfg: Config = {
      root: __dirname,
      env: Environment.DEVELOPMENT,
      web: {
        host: 'localhost',
        port: 1000,
        tls: null,
      },
      knex: {
        client: 'pg',
        connection: {
          host: 'localhost',
          port: 5432,
          database: 'postgres',
          user: 'foo',
        },
      },
      email: {
        postmark_key: 'foo',
      },
      secret: {
        jwt_secret: 'lol',
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
        tls: null,
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
      secret: {
        jwt_secret: '',
      },
    };

    expect(() => validateConfig(cfg)).toThrow();
  });

});
