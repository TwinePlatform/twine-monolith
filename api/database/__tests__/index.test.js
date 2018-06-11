const fs = require('fs');
const path = require('path');
const db = require('..');

describe('Database support functions', () => {
  describe('buildQueryFromFile', () => {


    test('builds path properly', () => {
      const _ = fs.readFileSync;
      fs.readFileSync = (a) => a;
      const knex = { raw: (a) => a };

      const result = db.buildQueryFromFile('foo')(knex);

      expect(result).toBe(path.resolve(__dirname, '..', 'migrations', 'sql', 'foo'));

      fs.readFileSync = _;
    });
  });
});
