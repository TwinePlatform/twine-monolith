import { getTimeDiff } from '../time';

describe('time utils', () => {
  describe(':: getTimeDiff', () => {
    test('if neither value is set return 0 diff', () => {
      const actual = getTimeDiff(null, null);
      expect(actual).toEqual([0, 0]);
    });

    test('if start value is not set return 0 diff', () => {
      const actual = getTimeDiff(null, new Date());
      expect(actual).toEqual([0, 0]);
    });

    test('if end value is not set return 0 diff', () => {
      const actual = getTimeDiff(new Date(), null);
      expect(actual).toEqual([0, 0]);
    });

    test('same time returns 0 diff', () => {
      const date = new Date();
      const actual = getTimeDiff(date, date);
      expect(actual).toEqual([0, 0]);
    });

    test('same time returns 0 diff', () => {
      const date = new Date();
      const actual = getTimeDiff(date, date);
      expect(actual).toEqual([0, 0]);
    });

    test('returns 0 diff if end is before start', () => {
      const start = new Date('2019-10-14T15:15:26.810Z');
      const end = new Date('2019-10-14T10:30:26.810Z');
      const actual = getTimeDiff(start, end);
      expect(actual).toEqual([0, 0]);
    });

    test('returns hours & mins diff if start is before end', () => {
      const start = new Date('2019-10-14T10:30:26.810Z');
      const end = new Date('2019-10-14T15:15:26.810Z');
      const actual = getTimeDiff(start, end);
      expect(actual).toEqual([4, 45]);
    });
  });
});
