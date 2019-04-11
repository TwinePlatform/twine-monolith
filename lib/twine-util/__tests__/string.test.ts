import { capitalise } from '../string';

describe('String', () => {
  describe('capitalise', () => {
    test('should capitalise the first character of lowercase string', () => {
      expect(capitalise('foo')).toBe('Foo');
    });

    test('should leave uppercase string unchanged', () => {
      expect(capitalise('FOO')).toBe('FOO');
    });

    test('should leave capitalised string unchanged', () => {
      expect(capitalise('Foo')).toBe('Foo');
    })
  })
})
