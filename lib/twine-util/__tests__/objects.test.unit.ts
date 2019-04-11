import { Objects } from '..';


describe('Utilities :: Objects', () => {
  describe('renameKeys', () => {
    test('should rename object keys', () => {
      const o = { a: 1, b: 2, c: 3 };
      const keyMap = { a: 'alpha', b: 'beta', c: 'gamma' };

      expect(Objects.renameKeys(keyMap, o)).toEqual({ alpha: 1, beta: 2, gamma: 3 });
    });

    test('keys not in map left unchanged', () => {
      const o = { a: 1, b: 2, c: 3 };
      const keyMap = { a: 'alpha', c: 'gamma' };

      expect(Objects.renameKeys(keyMap, o)).toEqual({ alpha: 1, b: 2, gamma: 3 });
    });

    test('keys not in object ignored', () => {
      const o = { a: 1, b: 2 };
      const keyMap = { a: 'alpha', b: 'beta', c: 'gamma' };

      expect(Objects.renameKeys(keyMap, o)).toEqual({ alpha: 1, beta: 2 });
    });
  });
});
