import { isDateString, abbreviateDateString } from '../util';
import Months from '../../../util/months';


describe('Data manipulation utilities', () => {
  describe(':: isDateString helper', () => {
    test('SUCCESS - returns true if given date string', () => {
      const expected = isDateString('January 2019');
      expect(expected).toBe(true);
    });
    test('SUCCESS - returns false if given non-date string', () => {
      const expected = isDateString('Jelly 2019');
      expect(expected).toBe(false);
    });
    test('SUCCESS - returns false if given non-date string', () => {
      const expected = isDateString('January');
      expect(expected).toBe(false);
    });
  });

  describe(':: abbreviateDateString helper', () => {
    test('SUCCESS - returns abbreviated month in date string', () => {
      const expected = abbreviateDateString(Months.format.table, 'January 2019');
      expect(expected).toBe('Jan 19');
    });
  });
});
