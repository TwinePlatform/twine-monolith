const fs = require('fs');
const path = require('path');
const { readConfig, validateConfig, DEVELOPMENT, TESTING, PRODUCTION } = require('..');


describe('Config', () => {
  test(`readConfig | ${DEVELOPMENT} | undefined path`, (t) => {
    const config = readConfig(DEVELOPMENT);

    expect(config.web).toEqual({ port: 4000, host: 'localhost', tls: null });
  });

  test(`readConfig | ${TESTING} | undefined path`, (t) => {
    const config = readConfig(TESTING);

    expect(config.web).toEqual({ port: 4001, host: 'localhost', tls: null });
  });

  test(`readConfig | ${PRODUCTION} | undefined path`, (t) => {
    const config = readConfig(PRODUCTION);

    expect(config.web).toEqual({ port: 4002, host: 'localhost', tls: null });
  });

  test(`readConfig | ${DEVELOPMENT} | defined path`, (t) => {
    const fpath = path.join(__dirname, 'foo.json');

    fs.writeFileSync(fpath, JSON.stringify({ web: { port: 1000 } }));

    const config = readConfig(DEVELOPMENT, fpath);

    expect(config.web).toEqual({ port: 1000, host: 'localhost', tls: null });
    fs.unlinkSync(fpath);
  });

  test(`readConfig | ${DEVELOPMENT} | without SSL`, (t) => {
    const temp = process.env.DATABASE_URL_DEV;
    process.env.DATABASE_URL_DEV = temp.replace('ssl=true', '');

    const config = readConfig(DEVELOPMENT);

    expect(config.psql.ssl).toBe(false);

    process.env.DATABASE_URL_DEV = temp;
  });

  test(`readConfig | ${DEVELOPMENT} | with SSL`, (t) => {
    const temp = process.env.DATABASE_URL_DEV;
    process.env.DATABASE_URL_DEV = `${temp.replace(/\?.*/, '')}?ssl=true`;

    const config = readConfig(DEVELOPMENT);

    expect(config.psql.ssl).toBe(true);

    process.env.DATABASE_URL_DEV = temp;
  });

  test('Config | validateConfig | valid config', (t) => {
    const cfg = {
      env: DEVELOPMENT,
      web: {
        host: 'localhost',
        port: 1000,
        tls: null,
      },
      psql: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'foo',
      },
      email: {
        postmark_key: 'hello',
        twine_email: 'visitor@twineplatform.org',
      },
      session: {
        standard_jwt_secret: 'secretstring20202020',
        cb_admin_jwt_secret: 'secretstring20202020',
        hmac_secret: 'secretstringagain202020',
        ttl: 108000000,
      },
    };

    t.doesNotThrow(() => validateConfig(cfg));
    t.end();
  });

  test('Config | validateConfig | invalid config', (t) => {
    const cfg = {
      env: DEVELOPMENT,
      web: {
        host: 'localhost',
        port: 1000,
        tls: null,
      },
      psql: {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'foo',
      },
      email: {
        postmark_key: null,
        twine_email: null,
      },
      session: {
        standard_jwt_secret: null,
        cb_admin_jwt_secret: null,
        hmac_secret: null,
        ttl: 108000000,
      },
    };

    t.throws(() => validateConfig(cfg));
    t.end();
  });

});

