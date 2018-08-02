import { getConfig, validateConfig, Environment, Config } from '..';

describe('Config', () => {
  test(`getConfig | ${Environment.DEVELOPMENT}`, () => {
    const config = getConfig(Environment.DEVELOPMENT);

    expect(config.web).toEqual({
      host: 'localhost',
      port: 4000,
      router: { stripTrailingSlash: true },
      tls: null });
  });

  test(`getConfig | ${Environment.TESTING}`, () => {
    const config = getConfig(Environment.TESTING);

    expect(config.web).toEqual({
      host: 'localhost',
      port: 4001,
      router: { stripTrailingSlash: true },
      tls: null });
  });

  test(`getConfig | ${Environment.PRODUCTION}`, () => {
    const config = getConfig(Environment.PRODUCTION);


    expect(config.web).toEqual({
      host: '0.0.0.0',
      port: 4002,
      router: { stripTrailingSlash: true },
      tls: null });

  });

  test(`getConfig | Invalid environment defaults to ${Environment.DEVELOPMENT}`, () => {
    const config = getConfig('foo');

    expect(config.web).toEqual({
      host: 'localhost',
      port: 4000,
      router: { stripTrailingSlash: true },
      tls: null });
  });

  test('Config | validateConfig | valid config', () => {
    const cfg: Config = {
      root: __dirname,
      env: Environment.DEVELOPMENT,
      web: {
        host: 'localhost',
        port: 1000,
        router: { stripTrailingSlash: true },
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
      qrcode: {
        secret: 'wftg4yj93g0irwfone49t2jwfeefwrgeijot3efwrtnjkbh',
      },
    };

    expect(() => validateConfig(cfg)).toThrow();
  });

});
