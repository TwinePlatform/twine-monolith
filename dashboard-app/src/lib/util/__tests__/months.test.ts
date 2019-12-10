import moment from 'moment';
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

  describe(':: formattedToDate', () => {
    test(`${Months.format.abbreviated}`, () => {
      const date = moment();
      const result = Months.formattedToDate(date.format(Months.format.abbreviated));
      const expected = date.clone().startOf('month').toDate()
      expect(result).toEqual(expected);
    });

    test(`${Months.format.verbose}`, () => {
      const date = moment();
      const result = Months.formattedToDate(date.format(Months.format.verbose));
      const expected = date.clone().startOf('month').toDate()
      expect(result).toEqual(expected);
    });

    test(`Invalid format`, () => {
      const date = moment();
      expect(() => Months.formattedToDate(date.format(Months.format.filename))).toThrowError('Invalid date');
    });
  });

  describe(':: sortFormatted', () => {
    test('Already sorted array is unchanged', () => {
      const input = ['May 2017', 'June 2017', 'August 2018'];
      expect(Months.sortFormatted(input)).toEqual(input);
    });

    test('Reverse sorted array is reversed', () => {
      const input = ['May 2017', 'June 2017', 'August 2018'].reverse();
      expect(Months.sortFormatted(input)).toEqual(input.reverse());
    });

    test('Unsorted array is sorted', () => {
      const input = ['May 2017', 'August 2018', 'June 2017', 'October 2015', 'October 2019', 'September 2017'];
      expect(Months.sortFormatted(input)).toEqual([
        'October 2015',
        'May 2017',
        'June 2017',
        'September 2017',
        'August 2018',
        'October 2019',
      ]);
    });

    test('Invalid date strings sorted to the beginning of array', () => {
      const input = ['May 2017', 'August 2018', 'June 2017', 'Not a date', 'October 2019', 'September 2017'];
      expect(Months.sortFormatted(input)).toEqual([
        'Not a date',
        'May 2017',
        'June 2017',
        'September 2017',
        'August 2018',
        'October 2019',
      ]);
    })
  });
});
