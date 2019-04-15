import { renameKeys } from '..';

describe('Utils', () => {
  describe('renameKeys', () => {
    test('should rename object keys', () => {
      const o = { a: 1, b: 2, c: 3 };
      const keyMap = { a: 'alpha', b: 'beta', c: 'gamma' };

      expect(renameKeys(keyMap, o)).toEqual({ alpha: 1, beta: 2, gamma: 3 });
    });
  });
});
