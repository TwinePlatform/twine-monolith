import { sentenceCreator } from '../util';

describe('DataCard :: sentenceCreator', () => {
  test('returns empty array when empty', () => {
    expect(sentenceCreator([])).toEqual([]);
  });
  test('returns array when it contains 1 element', () => {
    expect(sentenceCreator(['hi'])).toEqual(['hi']);
  });
  test('adds "and" for 2 elements', () => {
    const sentence = sentenceCreator(['chocolate', 'bananas']);
    const readableSentence = sentence.join('');
    expect(sentence).toEqual(['chocolate', ' and ', 'bananas']);
    expect(readableSentence).toBe('chocolate and bananas');
  });
  test('adds "," & "and" for 3 elements', () => {
    const sentence = sentenceCreator(['chocolate', 'bananas', 'peanut butter']);
    const readableSentence = sentence.join('');
    expect(sentence).toEqual(['chocolate', ', ', 'bananas', ' and ', 'peanut butter']);
    expect(readableSentence).toBe('chocolate, bananas and peanut butter');
  });
  test('adds multiple "," & "and" for 4 elements', () => {
    const sentence = sentenceCreator(['chocolate', 'bananas', 'peanut butter', 'ice cream']);
    const readableSentence = sentence.join('');
    expect(sentence)
      .toEqual(['chocolate', ', ', 'bananas', ', ', 'peanut butter', ' and ', 'ice cream']);
    expect(readableSentence).toBe('chocolate, bananas, peanut butter and ice cream');
  });
});
