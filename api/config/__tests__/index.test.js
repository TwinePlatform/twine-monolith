const fs = require('fs');
const path = require('path');
const {
  readConfig, validateConfig, DEVELOPMENT, TESTING, PRODUCTION,
} = require('..');


describe('Config', () => {
  test(`readConfig | ${DEVELOPMENT} | undefined path`, () => {
    const config = readConfig(DEVELOPMENT);

    expect(config.web).toEqual({ port: 4000, host: 'localhost', tls: null });
  });

  test(`readConfig | ${TESTING} | undefined path`, () => {
    const config = readConfig(TESTING);

    expect(config.web).toEqual({ port: 4001, host: 'localhost', tls: null });
  });

  test(`readConfig | ${PRODUCTION} | undefined path`, () => {
    const config = readConfig(PRODUCTION);

    expect(config.web).toEqual({ port: 4002, host: 'localhost', tls: null });
  });

  test(`readConfig | ${DEVELOPMENT} | defined path`, () => {
    const fpath = path.join(__dirname, 'foo.json');

    fs.writeFileSync(fpath, JSON.stringify({ web: { port: 1000 } }));

    const config = readConfig(DEVELOPMENT, fpath);

    expect(config.web).toEqual({ port: 1000, host: 'localhost', tls: null });
    fs.unlinkSync(fpath);
  });

  test('Config | validateConfig | valid config', () => {
    const cfg = {
      root: __dirname,
      env: DEVELOPMENT,
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
    };

    expect(() => validateConfig(cfg)).not.toThrow();
  });

  test('Config | validateConfig | invalid config', () => {
    const cfg = {
      env: DEVELOPMENT,
      web: {
        host: 'localhost',
        port: 1000,
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
    };

    expect(() => validateConfig(cfg)).toThrow();
  });

});

