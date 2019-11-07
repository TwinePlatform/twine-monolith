import { isDateString, formatDateString, abbreviateChartLabels } from '../util';
import Months from '../../../../lib/util/months';


describe('Data manipulation utilities', () => {
  describe(':: isDateString', () => {
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

  describe(':: formatDateString', () => {
    test('SUCCESS - returns formatted month in date string', () => {
      const expected = formatDateString(Months.format.abbreviated, 'January 2019');
      expect(expected).toBe('Jan 2019');
    });
  });

  describe(':: abbreviateChartLabels', () => {
    test('date string labels are formatted', () => {
      expect(abbreviateChartLabels(['January 2018', 'August 2013', 'July 2020']))
        .toEqual([['Jan', '2018'], ['Aug', '2013'], ['Jul', '2020']]);
    });
    test('non-date string labels < 10 are unchanged', () => {
      const input = ['woo', 'ahh', 'boooiiii', 'wuifb38q3'];
      expect(abbreviateChartLabels(input)).toEqual(input);
    })
    test('non-date string labels >= 10 are truncated', () => {
      const input = ['wooskmadndfw', 'ahhqoieo20r', 'boooiiiinnggggg', 'ewuifb38q3'];
      expect(abbreviateChartLabels(input)).toEqual([
        'wooskmadnd...',
        'ahhqoieo20...',
        'boooiiiinn...',
        'ewuifb38q3'
      ]);
    });
    test('mixed case', () => {
      const input = ['January 2028', 'oiewfnh4082fw', 'ooooo', 'August 1992'];
      expect(abbreviateChartLabels(input)).toEqual([
        ['Jan', '2028'],
        'oiewfnh408...',
        'ooooo',
        ['Aug', '1992'],
      ]);
    });
  })
});
