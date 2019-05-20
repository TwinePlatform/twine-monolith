import Months from '../months';

describe('Util Months', () => {
  describe(':: range', () => {
    test('SUCCESS - returns months and years', () => {
      const from = new Date('01-01-18');
      const to = new Date('12-31-18');
      const months = Months.range(from, to, Months.format.verbose);
      expect(months).toEqual([
        'January 2018',
        'February 2018',
        'March 2018',
        'April 2018',
        'May 2018',
        'June 2018',
        'July 2018',
        'August 2018',
        'September 2018',
        'October 2018',
        'November 2018',
        'December 2018',
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
