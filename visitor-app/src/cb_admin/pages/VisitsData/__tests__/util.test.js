import Mockdate from 'mockdate';
import { AgeGroups, VisitsStats, VisitorStats, calculateStepSize } from '../util';
import { DateRangesEnum } from '../dateRange';


describe('Visits Data Utilities', () => {
  describe('AgeGroups', () => {
    test(':: toSelectOptions', () => {
      expect(AgeGroups.toSelectOptions()).toEqual([
        { key: 0, value: 'All' },
        { key: 1, value: '0-17' },
        { key: 2, value: '18-34' },
        { key: 3, value: '35-50' },
        { key: 4, value: '51-69' },
        { key: 5, value: '70+' },
      ]);
    });

    describe(':: fromBirthYear', () => {
      beforeAll(() => {
        Mockdate.set('2019-10-01');
      });

      afterAll(() => {
        Mockdate.reset();
      });

      Object.entries({
        invalid: [2100, 2040],
        '0-17': [2019, 2009, 2007, 2015, 2003, 2002],
        '18-34': [2001, 1999, 1990, 1989, 1985],
        '35-50': [1984, 1980, 1979, 1971, 1969],
        '51-69': [1968, 1962, 1960, 1955, 1951, 1950],
        '70+': [1943, 1936, 1918, 1917, 1912],
      })
        .forEach(([group, years]) => {
          const label = group === 'invalid' ? 'are' : 'should be in';

          years.forEach((year) => {
            test(`${year} ${label} ${group}`, () => {
              if (group === 'invalid') {
                expect(() => AgeGroups.fromBirthYear(year)).toThrow();
              } else {
                expect(AgeGroups.fromBirthYear(year)).toBe(group);
              }
            });
          });
        });
    });
  });

  describe('VisitsStats', () => {
    describe('calculateGenderStatistics', () => {
      test('empty list gives empty stats object', () => {
        expect(VisitsStats.calculateGenderStatistics([])).toEqual({});
      });

      test('basic sanity check', () => {
        const logs = [
          { gender: 'male' },
          { gender: 'female' },
          { gender: 'prefer not to say' },
          { gender: 'male' },
          { gender: 'female' },
          { gender: 'female' },
        ];

        expect(VisitsStats.calculateGenderStatistics(logs)).toEqual({
          male: 2,
          female: 3,
          'prefer not to say': 1,
        });
      });
    });

    describe('calculateAgeGroupStatistics', () => {
      test('empty list gives empty stats object', () => {
        expect(VisitsStats.calculateAgeGroupStatistics([])).toEqual({});
      });

      test('basic sanity check', () => {
        const logs = [
          { birthYear: 1999 },
          { birthYear: 2019 },
          { birthYear: 1980 },
          { birthYear: 1954 },
          { birthYear: 1971 },
          { birthYear: 1988 },
        ];

        expect(VisitsStats.calculateAgeGroupStatistics(logs)).toEqual({
          '0-17': 1,
          '18-34': 2,
          '35-50': 2,
          '51-69': 1,
        });
      });
    });

    describe('calculateCategoryStatistics', () => {
      test('empty list gives empty stats object', () => {
        expect(VisitsStats.calculateCategoryStatistics([])).toEqual({});
      });

      test('basic sanity check', () => {
        const logs = [
          { category: 'foo' },
          { category: 'foo' },
          { category: 'bar' },
          { category: 'bar' },
          { category: 'foo' },
          { category: '---' },
        ];

        expect(VisitsStats.calculateCategoryStatistics(logs)).toEqual({
          foo: 3,
          bar: 2,
          '---': 1,
        });
      });
    });

    describe('calculateActivityStatistics', () => {
      test('empty list gives empty stats object', () => {
        expect(VisitsStats.calculateActivityStatistics([])).toEqual({});
      });

      test('basic sanity check', () => {
        const logs = [
          { category: 'foo', visitActivity: 'one' },
          { category: 'foo', visitActivity: 'one' },
          { category: 'bar', visitActivity: 'two' },
          { category: 'bar', visitActivity: 'three' },
          { category: 'foo', visitActivity: 'four' },
          { category: '---', visitActivity: 'five' },
        ];

        expect(VisitsStats.calculateActivityStatistics(logs)).toEqual({
          foo: { one: 2, four: 1 },
          bar: { two: 1, three: 1 },
          '---': { five: 1 },
        });
      });
    });

    describe('calculateTimePeriodStatistics', () => {
      test('empty list gives empty stats object', () => {
        const since = new Date('2018-12-01');
        const until = new Date('2019-10-31');
        const dateRange = DateRangesEnum.LAST_12_MONTHS;

        expect(VisitsStats.calculateTimePeriodStatistics(since, until, dateRange, [])).toEqual({
          'Dec 2018': 0,
          'Jan 2019': 0,
          'Feb 2019': 0,
          'Mar 2019': 0,
          'Apr 2019': 0,
          'May 2019': 0,
          'Jun 2019': 0,
          'Jul 2019': 0,
          'Aug 2019': 0,
          'Sep 2019': 0,
          'Oct 2019': 0,
        });
      });

      test(`basic sanity check :: ${DateRangesEnum.LAST_12_MONTHS}`, () => {
        const since = new Date('2018-12-01');
        const until = new Date('2019-10-31');
        const dateRange = DateRangesEnum.LAST_12_MONTHS;

        const logs = [
          { createdAt: '2019-10-10' },
          { createdAt: '2019-10-15' },
          { createdAt: '2019-06-12' },
          { createdAt: '2019-08-22' },
          { createdAt: '2018-12-12' },
          { createdAt: '2019-01-02' },
        ];

        expect(VisitsStats.calculateTimePeriodStatistics(since, until, dateRange, logs)).toEqual({
          'Dec 2018': 1,
          'Jan 2019': 1,
          'Feb 2019': 0,
          'Mar 2019': 0,
          'Apr 2019': 0,
          'May 2019': 0,
          'Jun 2019': 1,
          'Jul 2019': 0,
          'Aug 2019': 1,
          'Sep 2019': 0,
          'Oct 2019': 2,
        });
      });

      test(`basic sanity check :: ${DateRangesEnum.LAST_MONTH}`, () => {
        const since = new Date('2019-10-01');
        const until = new Date('2019-10-31');
        const dateRange = DateRangesEnum.LAST_MONTH;

        const logs = [
          { createdAt: '2019-10-10' },
          { createdAt: '2019-10-15' },
          { createdAt: '2019-10-22' },
          { createdAt: '2019-10-12' },
        ];

        expect(VisitsStats.calculateTimePeriodStatistics(since, until, dateRange, logs)).toEqual({
          '30 Sep': 0,
          '07 Oct': 2,
          '14 Oct': 1,
          '21 Oct': 1,
          '28 Oct': 0,
        });
      });

      test(`basic sanity check :: ${DateRangesEnum.LAST_WEEK}`, () => {
        const since = new Date('2019-10-24');
        const until = new Date('2019-10-31');
        const dateRange = DateRangesEnum.LAST_WEEK;

        const logs = [
          { createdAt: '2019-10-24' },
          { createdAt: '2019-10-25' },
          { createdAt: '2019-10-28' },
          { createdAt: '2019-10-30' },
        ];

        expect(VisitsStats.calculateTimePeriodStatistics(since, until, dateRange, logs)).toEqual({
          '24 Oct': 1,
          '25 Oct': 1,
          '26 Oct': 0,
          '27 Oct': 0,
          '28 Oct': 1,
          '29 Oct': 0,
          '30 Oct': 1,
        });
      });
    });
  });

  describe.only('VisitorStats', () => {
    describe('calculateGenderStatistics', () => {
      test('empty list gives empty stats object', () => {
        expect(VisitorStats.calculateGenderStatistics([])).toEqual({});
      });

      test('basic sanity check', () => {
        const visitors = [
          { gender: 'male' },
          { gender: 'female' },
          { gender: 'prefer not to say' },
          { gender: 'male' },
          { gender: 'female' },
          { gender: 'female' },
        ];

        expect(VisitorStats.calculateGenderStatistics(visitors)).toEqual({
          male: 2,
          female: 3,
          'prefer not to say': 1,
        });
      });
    });

    describe('calculateAgeGroupStatistics', () => {
      test('empty list gives empty stats object', () => {
        expect(VisitorStats.calculateAgeGroupStatistics([])).toEqual({});
      });

      test('basic sanity check', () => {
        const visitors = [
          { birthYear: 1999 },
          { birthYear: 2019 },
          { birthYear: 1980 },
          { birthYear: 1954 },
          { birthYear: 1971 },
          { birthYear: 1988 },
        ];

        expect(VisitorStats.calculateAgeGroupStatistics(visitors)).toEqual({
          '0-17': 1,
          '18-34': 2,
          '35-50': 2,
          '51-69': 1,
        });
      });
    });

    describe('calculateCategoryStatistics', () => {
      test('empty list gives empty stats object', () => {
        expect(VisitorStats.calculateCategoryStatistics([])).toEqual({});
      });

      test('basic sanity check', () => {
        const visitors = [
          { category: ['foo'] },
          { category: ['foo'] },
          { category: ['bar'] },
          { category: ['bar'] },
          { category: ['foo'] },
          { category: ['---'] },
        ];

        expect(VisitorStats.calculateCategoryStatistics(visitors)).toEqual({
          foo: 3,
          bar: 2,
          '---': 1,
        });
      });
    });

    describe('calculateActivityStatistics', () => {
      test('empty list gives empty stats object', () => {
        expect(VisitorStats.calculateActivityStatistics([], [])).toEqual({});
      });

      test('basic sanity check', () => {
        const visitors = [
          { category: ['foo'], visitActivity: ['one'] },
          { category: ['foo'], visitActivity: ['one'] },
          { category: ['bar'], visitActivity: ['two'] },
          { category: ['bar'], visitActivity: ['three'] },
          { category: ['foo'], visitActivity: ['four'] },
          { category: ['---'], visitActivity: ['five'] },
        ];

        const activities = [
          { name: 'one', category: 'foo' },
          { name: 'two', category: 'bar' },
          { name: 'three', category: 'bar' },
          { name: 'four', category: 'foo' },
          { name: 'five', category: '---' },
        ];

        expect(VisitorStats.calculateActivityStatistics(visitors, activities)).toEqual({
          foo: { one: 2, four: 1 },
          bar: { two: 1, three: 1 },
          '---': { five: 1 },
        });
      });
    });

    describe('calculateTimePeriodStatistics', () => {
      test('empty list gives empty stats object', () => {
        const since = new Date('2018-12-01');
        const until = new Date('2019-10-31');
        const dateRange = DateRangesEnum.LAST_12_MONTHS;

        expect(VisitorStats.calculateTimePeriodStatistics(since, until, dateRange, [])).toEqual({
          'Dec 2018': 0,
          'Jan 2019': 0,
          'Feb 2019': 0,
          'Mar 2019': 0,
          'Apr 2019': 0,
          'May 2019': 0,
          'Jun 2019': 0,
          'Jul 2019': 0,
          'Aug 2019': 0,
          'Sep 2019': 0,
          'Oct 2019': 0,
        });
      });

      test(`basic sanity check :: ${DateRangesEnum.LAST_12_MONTHS}`, () => {
        const since = new Date('2018-12-01');
        const until = new Date('2019-10-31');
        const dateRange = DateRangesEnum.LAST_12_MONTHS;

        const visitors = [
          { createdAt: ['2019-10-10', '2019-10-11', '2019-06-15'] },
          { createdAt: ['2019-10-15'] },
          { createdAt: ['2019-06-12'] },
          { createdAt: ['2019-08-22'] },
          { createdAt: ['2018-12-12'] },
          { createdAt: ['2019-01-02'] },
        ];

        expect(VisitorStats.calculateTimePeriodStatistics(since, until, dateRange, visitors))
          .toEqual({
            'Dec 2018': 1,
            'Jan 2019': 1,
            'Feb 2019': 0,
            'Mar 2019': 0,
            'Apr 2019': 0,
            'May 2019': 0,
            'Jun 2019': 1,
            'Jul 2019': 0,
            'Aug 2019': 1,
            'Sep 2019': 0,
            'Oct 2019': 2,
          });
      });

      test(`basic sanity check :: ${DateRangesEnum.LAST_MONTH}`, () => {
        const since = new Date('2019-10-01');
        const until = new Date('2019-10-31');
        const dateRange = DateRangesEnum.LAST_MONTH;

        const logs = [
          { createdAt: '2019-10-10' },
          { createdAt: '2019-10-15' },
          { createdAt: '2019-10-22' },
          { createdAt: '2019-10-12' },
        ];

        expect(VisitorStats.calculateTimePeriodStatistics(since, until, dateRange, logs)).toEqual({
          '30 Sep': 0,
          '07 Oct': 2,
          '14 Oct': 1,
          '21 Oct': 1,
          '28 Oct': 0,
        });
      });

      test(`basic sanity check :: ${DateRangesEnum.LAST_WEEK}`, () => {
        const since = new Date('2019-10-24');
        const until = new Date('2019-10-31');
        const dateRange = DateRangesEnum.LAST_WEEK;

        const logs = [
          { createdAt: '2019-10-24' },
          { createdAt: '2019-10-25' },
          { createdAt: '2019-10-28' },
          { createdAt: '2019-10-30' },
        ];

        expect(VisitorStats.calculateTimePeriodStatistics(since, until, dateRange, logs)).toEqual({
          '24 Oct': 1,
          '25 Oct': 1,
          '26 Oct': 0,
          '27 Oct': 0,
          '28 Oct': 1,
          '29 Oct': 0,
          '30 Oct': 1,
        });
      });
    });
  });

  describe('calculateStepSize', () => {
    test('minimum of one for empty input object', () => {
      expect(calculateStepSize({})).toBe(1);
    });

    test('step size should give approx. five ticks', () => {
      expect(calculateStepSize({ foo: 10 })).toBe(2);
      expect(calculateStepSize({ foo: 10, bar: 1 })).toBe(2);
      expect(calculateStepSize({ foo: 10, bar: 100 })).toBe(20);
      expect(calculateStepSize({ foo: 22, bar: 12 })).toBe(4);
    });
  });
});
