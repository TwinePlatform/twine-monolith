import { Objects } from '..';


describe('Utilities :: Objects', () => {
  describe('reduceKeys', () => {
    test('empty object returns initial value', () => {
      expect(Objects.reduceKeys((a, b) => b, 'foo', {})).toBe('foo');
    });

    test('non-empty object applies function on each key', () => {
      const cb = jest.fn((a, b) => a + b);
      const result = Objects.reduceKeys(cb, '', { foo: 1, bar: 2 });
      expect(result).toBe('foobar');
      expect(cb).toHaveBeenCalledTimes(2);
      expect(cb).toHaveBeenLastCalledWith('foo', 'bar');
      expect(cb).toHaveBeenCalledWith('', 'foo');
    });
  });

  describe('reduceValues', () => {
    test('empty object returns initial value', () => {
      expect(Objects.reduceValues<string, string>((a, b) => b, 'foo', {})).toBe('foo');
    });

    test('non-empty object applies function on each value', () => {
      const cb = jest.fn((a, b) => a + b);
      const result = Objects.reduceValues(cb, 0, { foo: 1, bar: 2 });
      expect(result).toBe(3);
      expect(cb).toHaveBeenCalledTimes(2);
      expect(cb).toHaveBeenLastCalledWith(1, 2);
      expect(cb).toHaveBeenCalledWith(0, 1);
    });
  });

  describe('renameKeys', () => {
    test('should rename object keys', () => {
      const o = { a: 1, b: 2, c: 3 };
      const keyMap = { a: 'alpha', b: 'beta', c: 'gamma' };

      expect(Objects.renameKeys(keyMap)(o)).toEqual({ alpha: 1, beta: 2, gamma: 3 });
    });

    test('keys not in map left unchanged', () => {
      const o = { a: 1, b: 2, c: 3 };
      const keyMap = { a: 'alpha', c: 'gamma' };

      expect(Objects.renameKeys(keyMap)(o)).toEqual({ alpha: 1, b: 2, gamma: 3 });
    });

    test('keys not in object ignored', () => {
      const o = { a: 1, b: 2 };
      const keyMap = { a: 'alpha', b: 'beta', c: 'gamma' };

      expect(Objects.renameKeys(keyMap)(o)).toEqual({ alpha: 1, beta: 2 });
    });
  });
});
