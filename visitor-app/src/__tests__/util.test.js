import { toCancellable, pairs, reduceVisitorsToFields, mapValues, combineValues, collectBy, repeat } from '../util';


describe('Client utility functions', () => {
  describe('toCancellable', () => {
    test('toCancellable | not cancelled, resolves', () => {
      const p = new Promise(resolve => setTimeout(resolve, 0));
      const q = toCancellable(p);

      return q;
    });

    test('toCancellable | not cancelled, rejects', () => {
      expect.assertions(1);

      const p = new Promise((resolve, reject) => setTimeout(() => reject(Error('foo')), 0));
      const q = toCancellable(p);

      return q.catch((error) => {
        expect(error.message).toBe('foo');
      });
    });

    test('toCancellable | cancelled, resolves', (done) => {
      expect.assertions(3);

      const success = jest.fn();
      const error = jest.fn();

      const p = new Promise(resolve => setTimeout(resolve, 0));
      const q = toCancellable(p);

      q.then(success, error);
      q.cancel();

      setTimeout(() => {
        expect(success).not.toHaveBeenCalled();
        expect(error).not.toHaveBeenCalled();
        expect(q.isCancelled).toBe(true);
        done();
      }, 10);
    });

    test('toCancellable | cancelled, rejects', (done) => {
      expect.assertions(3);

      const success = jest.fn();
      const error = jest.fn();

      const p = new Promise((resolve, reject) => setTimeout(() => reject(Error('foo')), 0));
      const q = toCancellable(p);

      q.then(success, error);
      q.cancel();

      setTimeout(() => {
        expect(success).not.toHaveBeenCalled();
        expect(error).not.toHaveBeenCalled();
        expect(q.isCancelled).toBe(true);
        done();
      }, 10);
    });
  });

  describe('pairs', () => {
    test('Empty array', () => {
      expect(pairs([])).toEqual([]);
    });

    test('Even length array', () => {
      expect(pairs([1, 2])).toEqual([[1, 2]]);
      expect(pairs([1, 2, 3, 4])).toEqual([[1, 2], [3, 4]]);
      expect(pairs([1, 2, 3, 4, 5, 6])).toEqual([[1, 2], [3, 4], [5, 6]]);
    });

    test('Odd length array', () => {
      expect(pairs([1])).toEqual([[1]]);
      expect(pairs([1, 2, 3])).toEqual([[1, 2], [3]]);
      expect(pairs([1, 2, 3, 4, 5])).toEqual([[1, 2], [3, 4], [5]]);
    });

    test('Non-array', () => {
      expect(() => pairs(1)).toThrow();
    });
  });

  describe('reduceVisitorsToFields', () => {
    test('empty array | []', () => {
      expect(reduceVisitorsToFields([])).toEqual([]);
    });

    test('single element array | [{...}]', () => {
      const input = [
        {
          id: 1,
          name: 'foo',
          email: 'foo@email.com',
          birthYear: 1982,
          postCode: 'EC2 4RT',
          phoneNumber: '0778934523',
          emailConsent: true,
          smsConsent: false,
          createdAt: '2018-12-01T12:33:21.923',
        },
      ];

      expect(reduceVisitorsToFields(input))
        .toEqual([]); // already have single user, no need to reduce fields
    });

    test('fields with all null values are removed', () => {
      const input = [
        {
          id: 1,
          name: 'foo',
          email: null,
          birthYear: 1982,
          postCode: 'EC2 4RT',
          phoneNumber: '0778934523',
          emailConsent: true,
          smsConsent: false,
          createdAt: '2018-12-01T12:33:21.923',
        },
        {
          id: 1,
          name: 'bar',
          email: null,
          birthYear: 1995,
          postCode: 'N1 2FD',
          phoneNumber: '02078439732',
          emailConsent: true,
          smsConsent: false,
          createdAt: '2018-12-01T12:33:42.923',
        },
        {
          id: 1,
          name: 'baz',
          email: null,
          birthYear: 1921,
          postCode: 'NW12 0JK',
          phoneNumber: '0778124523',
          emailConsent: true,
          smsConsent: false,
          createdAt: '2018-12-01T12:32:01.923',
        },
      ];

      expect(reduceVisitorsToFields(input).sort())
        .toEqual(['name', 'birthYear', 'postCode', 'phoneNumber'].sort());
    });

    test('fields with identical values are removed', () => {
      const input = [
        {
          id: 1,
          name: 'foo',
          email: 'foo@email.com',
          birthYear: 1982,
          postCode: 'EC2 4RT',
          phoneNumber: '0778934523',
          emailConsent: true,
          smsConsent: false,
          createdAt: '2018-12-01T12:33:21.923',
        },
        {
          id: 1,
          name: 'bar',
          email: 'bar@email.com',
          birthYear: 1982,
          postCode: 'N1 2FD',
          phoneNumber: '02078439732',
          emailConsent: true,
          smsConsent: false,
          createdAt: '2018-12-01T12:33:42.923',
        },
        {
          id: 1,
          name: 'baz',
          email: 'baz@email.com',
          birthYear: 1982,
          postCode: 'NW12 0JK',
          phoneNumber: '0778124523',
          emailConsent: true,
          smsConsent: false,
          createdAt: '2018-12-01T12:32:01.923',
        },
      ];

      expect(reduceVisitorsToFields(input).sort())
        .toEqual(['name', 'email', 'postCode', 'phoneNumber'].sort());
    });
  });

  describe('mapValues', () => {
    test('empty object unchanged', () => {
      expect(mapValues(() => 1, {})).toEqual({});
    });

    test('identity function leaves object unchanged', () => {
      expect(mapValues(a => a, { a: 1, b: 2, c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
    });

    test('increment values', () => {
      expect(mapValues(a => a + 1, { a: 0, b: 1, c: 2 })).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe('combineValues', () => {
    test('empty array -> empty object', () => {
      expect(combineValues([])).toEqual({});
    });

    test('collects values in identical keys', () => {
      expect(combineValues([{ a: 1, b: 2, c: 3 }, { a: 1 }, { c: 2 }]))
        .toEqual({
          a: [1, 1],
          b: [2],
          c: [3, 2],
        });
    });
  });

  describe('collectBy', () => {
    test('empty array -> empty object', () => {
      expect(collectBy(() => 1, [])).toEqual({});
    });

    test('collect by key', () => {
      expect(collectBy(a => a.key, [{ key: 'a', value: 1 }, { key: 'a', value: 2 }, { key: 'b', value: 3 }]))
        .toEqual({
          a: [{ key: 'a', value: 1 }, { key: 'a', value: 2 }],
          b: [{ key: 'b', value: 3 }],
        });
    });
  });

  describe('repeat', () => {
    test('0 -> empty array', () => {
      expect(repeat([1, 2, 3], 0)).toEqual([]);
    });

    test('n <= length -> part of array', () => {
      expect(repeat([1, 2, 3], 1)).toEqual([1]);
      expect(repeat([1, 2, 3], 2)).toEqual([1, 2]);
      expect(repeat([1, 2, 3], 3)).toEqual([1, 2, 3]);
    });

    test('n > length -> repeat array', () => {
      expect(repeat([1, 2, 3], 4)).toEqual([1, 2, 3, 1]);
      expect(repeat([1, 2, 3], 5)).toEqual([1, 2, 3, 1, 2]);
      expect(repeat([1, 2, 3], 6)).toEqual([1, 2, 3, 1, 2, 3]);
      expect(repeat([1, 2, 3], 7)).toEqual([1, 2, 3, 1, 2, 3, 1]);
    });
  });
});
