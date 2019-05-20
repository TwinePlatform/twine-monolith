import Months from '../months';

describe('Util Months', () => {
  describe(':: range', () => {
    test('SUCCESS - returns months and years', () => {
      const from = new Date('01-01-18');
      const to = new Date('12-31-18');
      const months = Months.range(from, to);
      expect(months).toEqual([
        'January 18',
        'February 18',
        'March 18',
        'April 18',
        'May 18',
        'June 18',
        'July 18',
        'August 18',
        'September 18',
        'October 18',
        'November 18',
        'December 18',
      ]);
    });
  });
  describe(':: diff', () => {
    test('SUCCESS - diff of months in same year', () => {
      const from = new Date('01-01-18');
      const to = new Date('12-31-18');
      const diff = Months.diff(from, to);
      expect(diff).toEqual(11);
    });
    test('SUCCESS - diff of months in different year', () => {
      const from = new Date('07-20-16');
      const to = new Date('12-31-17');
      const diff = Months.diff(from, to);
      expect(diff).toEqual(17);
    });
  });
  describe(':: defaults', () => {
    test('SUCCESS - defaultFrom is start of the month', () => {
      const defaultFrom = Months.defaultFrom();
      expect(defaultFrom.getDate()).toEqual(1);
    });
    test('SUCCESS - defaultTo is end of the month', () => {
      const defaultTo = Months.defaultTo();
      expect([28, 29, 30, 31].includes(defaultTo.getDate())).toBe(true);
    });
  });
});
