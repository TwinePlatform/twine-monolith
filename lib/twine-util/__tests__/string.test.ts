import { capitalise, onlynl, listify, readableListify } from '../string';

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

  describe('listify + readableListify', () => {
    test('returns empty array when empty', () => {
      expect(listify([])).toEqual([]);
    });

    test('returns array when it contains 1 element', () => {
      expect(listify(['hi'])).toEqual(['hi']);
    });

    test('adds "and" for 2 elements', () => {
      const sentence = listify(['chocolate', 'bananas']);
      const readableSentence = readableListify(['chocolate', 'bananas']);
      expect(sentence).toEqual(['chocolate', ' and ', 'bananas']);
      expect(readableSentence).toBe('chocolate and bananas');
    });

    test('adds "," & "and" for 3 elements', () => {
      const sentence = listify(['chocolate', 'bananas', 'peanut butter']);
      const readableSentence = readableListify(['chocolate', 'bananas', 'peanut butter']);
      expect(sentence).toEqual(['chocolate', ', ', 'bananas', ' and ', 'peanut butter']);
      expect(readableSentence).toBe('chocolate, bananas and peanut butter');
    });

    test('adds multiple "," & "and" for 4 elements', () => {
      const sentence = listify(['chocolate', 'bananas', 'peanut butter', 'ice cream']);
      const readableSentence = readableListify(['chocolate', 'bananas', 'peanut butter', 'ice cream']);
      expect(sentence)
        .toEqual(['chocolate', ', ', 'bananas', ', ', 'peanut butter', ' and ', 'ice cream']);
      expect(readableSentence).toBe('chocolate, bananas, peanut butter and ice cream');
    });

    test('adds only commas if "and" option is present and false', () => {
      const sentence = listify(['chocolate', 'bananas', 'peanut butter', 'ice cream'], { and: false });
      const readableSentence = readableListify(['chocolate', 'bananas', 'peanut butter', 'ice cream'], { and: false });
      expect(sentence)
        .toEqual(['chocolate', ', ', 'bananas', ', ', 'peanut butter', ', ', 'ice cream']);
      expect(readableSentence).toBe('chocolate, bananas, peanut butter, ice cream');
    });

    test('adds "," and "and" normally if "and" option is present and true', () => {
      const sentence = listify(['chocolate', 'bananas', 'peanut butter', 'ice cream'], { and: true });
      const readableSentence = readableListify(['chocolate', 'bananas', 'peanut butter', 'ice cream'], { and: true });
      expect(sentence)
        .toEqual(['chocolate', ', ', 'bananas', ', ', 'peanut butter', ' and ', 'ice cream']);
      expect(readableSentence).toBe('chocolate, bananas, peanut butter and ice cream');
    });
  });
});
