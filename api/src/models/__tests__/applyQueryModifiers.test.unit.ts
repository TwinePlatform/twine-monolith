import * as Knex from 'knex';
import { Utils } from '../applyQueryModifiers';


describe('applyQueryModifiers', () => {
  const client = Knex({ client: 'postgresql' });

  describe('Utils', () => {
    test('whereBetween throws for underspecified query', () => {
      const qb = client('fake_table');
      expect(() => Utils.whereBetween(<any> { foo: [] })(qb)).toThrow();
    });

    test('whereBetween applies BETWEEN when upper and lower limits are supplied', () => {
      const qb = client('fake_table');
      const query = Utils.whereBetween({ foo: [1, 4] })(qb);
      expect(query.toString())
        .toBe('select * from "fake_table" where "foo" between 1 and 4');
    });

    test('whereBetween applies ">" when only lower limit is supplied', () => {
      const qb = client('fake_table');
      const query = Utils.whereBetween({ foo: [1, undefined] })(qb);
      expect(query.toString())
        .toBe('select * from "fake_table" where "foo" > 1');
    });

    test('whereBetween applies "<" when only upper limit is supplied', () => {
      const qb = client('fake_table');
      const query = Utils.whereBetween({ foo: [undefined, 4] })(qb);
      expect(query.toString())
        .toBe('select * from "fake_table" where "foo" < 4');
    });
  });
});
