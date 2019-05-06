import DateRange from '../dateRange';

describe('Util DateRange', () => {
  describe(':: months', () => {
    test('SUCCESS - standrd 12 months', () => {
      const months = DateRange.months;
      expect(months).toEqual([
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]);
    });
  });
  describe(':: getPastMonths', () => {
    test('SUCCESS - 12 months from January', () => {
      const months = DateRange.getPastMonths(1, 12);
      expect(months).toEqual([
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]);
    });
    test('SUCCESS - 6 months from January', () => {
      const months = DateRange.getPastMonths(1, 6);
      expect(months).toEqual([
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
      ]);
    });
    test('SUCCESS - 6 months from November', () => {
      const months = DateRange.getPastMonths(11, 6);
      expect(months).toEqual([
        'November',
        'December',
        'January',
        'February',
        'March',
        'April',
      ]);
    });
    test('SUCCESS - 16 months from March', () => {
      const months = DateRange.getPastMonths(3, 16);
      expect(months).toEqual([
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
      ]);
    });
    test('FAIL - unspecified month returns empty array', () => {
      const months = DateRange.getPastMonths(30, 3);
      expect(months).toEqual([]);
    });
  });
  describe(':: monthsDifference', () => {
    test('SUCCESS - gives difference for months in same year', () => {
      const from = new Date('01-01-19');
      const until = new Date('09-01-19');
      const months = DateRange.monthsDifference(from, until);
      expect(months).toEqual(8);
    });
    test('SUCCESS - gives difference for months in different year', () => {
      const from = new Date('09-01-18');
      const until = new Date('10-01-19');
      const months = DateRange.monthsDifference(from, until);
      expect(months).toEqual(11);
    });
    test('SUCCESS - gives difference for months over multiple years', () => {
      const from = new Date('10-01-17');
      const until = new Date('10-01-19');
      const months = DateRange.monthsDifference(from, until);
      expect(months).toEqual(24);
    });
    test('FAIL - from date is after until date returns 0', () => {
      const from = new Date('09-01-19');
      const until = new Date('10-01-18');
      const months = DateRange.monthsDifference(from, until);
      expect(months).toEqual(0);
    });
  });
});
