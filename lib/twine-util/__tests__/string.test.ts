import { capitalise, onlynl } from '../string';

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
    });
  });

  describe('onlynl', () => {
    test('should not transform single line strings without spaces', () => {
      expect(onlynl`hello`).toBe('hello');
      expect(onlynl`woo${1}foo${4}`).toBe('woo1foo4');
    });

    test('should remove spaces in single line strings', () => {
      expect(onlynl`hello  foo`).toBe('hellofoo');
    });

    test('should ignore multiple spaces in multi-line strings', () => {
      expect(onlynl`hello
                  foo`).toBe('hello\nfoo');
    });
  });
});
