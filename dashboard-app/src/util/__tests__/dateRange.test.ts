import DateRange from '../dateRange';

describe('Utils DateRange', () => {
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
});
