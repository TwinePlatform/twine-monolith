import { sort, Order } from '../arrays';


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
});
