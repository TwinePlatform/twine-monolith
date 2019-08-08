import { sort, headOrId, innerJoin, collectBy, truncate, Order } from '../arrays';


describe('Arrays', () => {
  describe('sort', () => {
    [
      {
        name: 'default sort criteria, ascending',
        args: {
          specs: [{ order: 'asc' as Order }],
          data: [4, 3, 2, 65, 1, 6],
        },
        expected: [1, 2, 3, 4, 6, 65],
      },
      {
        name: 'default sort criteria, descending',
        args: {
          specs: [{ order: 'desc' as Order }],
          data: [4, 3, 2, 65, 1, 6],
        },
        expected: [65, 6, 4, 3, 2, 1],
      },
      {
        name: 'single sort criteria, ascending',
        args: {
          specs: [{ order: 'asc' as Order, accessor: (o: any) => o.name }],
          data: [
            { name: 'jim', age: 1 },
            { name: 'zim', age: 10 },
            { name: 'moo', age: 54 },
          ],
        },
        expected: [
          { name: 'jim', age: 1 },
          { name: 'moo', age: 54 },
          { name: 'zim', age: 10 },
        ],
      },
      {
        name: 'single sort criteria, descending',
        args: {
          specs: [{ order: 'desc' as Order, accessor: (o: any) => o.name }],
          data: [
            { name: 'jim', age: 1 },
            { name: 'zim', age: 10 },
            { name: 'moo', age: 54 },
          ],
        },
        expected: [
          { name: 'zim', age: 10 },
          { name: 'moo', age: 54 },
          { name: 'jim', age: 1 },
        ],
      },
      {
        name: 'multiple sort criteria, ascending',
        args: {
          specs: [
            { order: 'asc' as Order, accessor: (o: any) => o.name },
            { order: 'asc' as Order, accessor: (o: any) => o.age },
          ],
          data: [
            { name: 'jim', age: 1 },
            { name: 'zim', age: 11 },
            { name: 'zim', age: 10 },
            { name: 'moo', age: 54 },
          ],
        },
        expected: [
          { name: 'jim', age: 1 },
          { name: 'moo', age: 54 },
          { name: 'zim', age: 10 },
          { name: 'zim', age: 11 },
        ],
      },
      {
        name: 'multiple sort criteria, descending',
        args: {
          specs: [
            { order: 'desc' as Order, accessor: (o: any) => o.name },
            { order: 'desc' as Order, accessor: (o: any) => o.age },
          ],
          data: [
            { name: 'jim', age: 1 },
            { name: 'zim', age: 11 },
            { name: 'zim', age: 10 },
            { name: 'moo', age: 54 },
          ],
        },
        expected: [
          { name: 'zim', age: 11 },
          { name: 'zim', age: 10 },
          { name: 'moo', age: 54 },
          { name: 'jim', age: 1 },
        ],
      },
      {
        name: 'multiple sort criteria, mixed',
        args: {
          specs: [
            { order: 'asc' as Order, accessor: (o: any) => o.name },
            { order: 'desc' as Order, accessor: (o: any) => o.age },
          ],
          data: [
            { name: 'jim', age: 1 },
            { name: 'zim', age: 11 },
            { name: 'zim', age: 10 },
            { name: 'moo', age: 54 },
          ],
        },
        expected: [
          { name: 'jim', age: 1 },
          { name: 'moo', age: 54 },
          { name: 'zim', age: 11 },
          { name: 'zim', age: 10 },
        ],
      },
    ]
      .forEach(({ name, args: { specs, data }, expected }) => {
        test(name, () => {
          if (typeof data[0] !== 'object') {
            expect(sort(specs, data as number[])).toEqual(expected);
          } else {
            expect(sort(specs, data as {}[])).toEqual(expected);
          }
        })
      })
  });

  describe('innerJoin', () => {
    test('should do nothing to two empty arrays', () => {
      expect(innerJoin([], [], (a, b) => true)).toEqual([]);
    });

    test('should return empty array for empty left side', () => {
      expect(innerJoin([], [{ a: 1 }], (a, b) => true)).toEqual([]);
    });

    test('should merge all objects for static TRUE predicate', () => {
      expect(innerJoin([{ a: 1 }, { b: 2 }], [{ c: 1 }, { d: 2 }], (a, b) => true))
        .toEqual([{ a: 1, c: 1 }, { a: 1, d: 2 }, { b: 2, c: 1 }, { b: 2, d: 2 }]);
    });

    test('should return empty array for static FALSE predicate', () => {
      expect(innerJoin([{ a: 1 }, { b: 2 }], [{ c: 1 }, { d: 2 }], (a, b) => false))
        .toEqual([]);
    });

    test('should merge objects when predicate == TRUE, ignore otherwise', () => {
      const left = [{ id: 1, name: 'foo' }, { id: 2, name: 'bar' }, { id: 3, name: 'baz' }];
      const right = [{ id: 1, pw: 'woo' }, { id: 2, pw: 'war' }];
      const pred = (a: { id: number, name: string}, b: { id: number, pw: string }) => a.id === b.id;
      expect(innerJoin(left, right, pred)).toEqual([
        { id: 1, name: 'foo', pw: 'woo' },
        { id: 2, name: 'bar', pw: 'war' }
      ]);
    });

    test('should only shallow merge', () => {
      // This isn't a strict requirement, but if it changes we should be notified about
      // it via a failing test
      type Data = { x: number, y: number };
      const data1 = { x: 1, y: 2 };
      const data2 = { x: 1, y: 2 };
      const left = [{ id: 1, name: 'foo', data: data1 }, { id: 2, name: 'bar', data: data2 }, { id: 3, name: 'baz', data: data1 }];
      const right = [{ id: 1, pw: 'woo' }, { id: 2, pw: 'war' }];
      const pred = (a: { id: number, name: string, data: Data }, b: { id: number, pw: string }) => a.id === b.id;
      const res = innerJoin(left, right, pred)
      expect(res).toEqual([
        { id: 1, name: 'foo', pw: 'woo', data: data1 },
        { id: 2, name: 'bar', pw: 'war', data: data2 },
      ]);
      expect((<any> res[0]).data).toBe(data1);
      expect((<any> res[1]).data).toBe(data2);
    });
  });

  describe('collectBy', () => {
    test('empty array should return empty object', () => {
      expect(collectBy(() => '1', [])).toEqual({});
    });

    test('constant key function collects all elements into the same key', () => {
      expect(collectBy(() => 'foo', [1, 2, 3, 4])).toEqual({ foo: [1, 2, 3, 4]});
    });

    test('values are collected into buckets defined by key function', () => {
      expect(collectBy((a) => a % 2 === 1 ? 'odd': 'even', [1, 2, 3, 4]))
        .toEqual({
          odd: [1, 3],
          even: [2, 4],
        });
    });
  });

  describe('truncate', () => {
    test('array below limit', () => {
      const xs = ['1', '2', '3'];
      expect(truncate(xs, 10, '...')).toEqual(xs);
    });

    test('array above limit', () => {
      const xs = ['1', '2', '3'];
      expect(truncate(xs, 2, '...')).toEqual(['1', '2', '...']);
    })
  });

  describe('headOrId', () => {
    test('returns head if array is passed in', () => {
      expect(headOrId([1, 2, 3, 4])).toBe(1);
      expect(headOrId(['foo', 'bar'])).toBe('foo');
      expect(headOrId([{ a: 1 }, 'foo', 1])).toEqual({ a: 1 });
    });

    test('returns argument if not array', () => {
      expect(headOrId(1)).toBe(1);
      expect(headOrId('foo')).toBe('foo');
      expect(headOrId(null)).toBe(null);
      expect(headOrId({ b: 1 })).toEqual({ b: 1 });
    });
  });
});
