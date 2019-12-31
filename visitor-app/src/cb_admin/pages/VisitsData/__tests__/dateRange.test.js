import Mockdate from 'mockdate';
import DateRanges, { DateRangesEnum } from '../dateRange';


describe('DateRange', () => {
  describe(':: toSelectOptions', () => {
    test('returns expected options objects', () => {
      expect(DateRanges.toSelectOptions()).toEqual([
        { key: '0', value: DateRangesEnum.THIS_WEEK },
        { key: '1', value: DateRangesEnum.LAST_WEEK },
        { key: '2', value: DateRangesEnum.LAST_MONTH },
        { key: '3', value: DateRangesEnum.LAST_12_MONTHS },
      ]);
    });
  });

  describe(':: toDates', () => {
    beforeAll(() => {
      Mockdate.set('2019-10-19');
    });

    afterAll(() => {
      Mockdate.reset();
    });

    test(`${DateRangesEnum.THIS_WEEK} :: Date range over the current calendar week only`, () => {
      expect(DateRanges.toDates(DateRangesEnum.THIS_WEEK)).toEqual({
        since: new Date('2019-10-14'),
        until: new Date('2019-10-20T23:59:59.999Z'),
      });
    });

    test(`${DateRangesEnum.LAST_WEEK} :: Date range over the last full week`, () => {
      expect(DateRanges.toDates(DateRangesEnum.LAST_WEEK)).toEqual({
        since: new Date('2019-10-07'),
        until: new Date('2019-10-13T23:59:59.999Z'),
      });
    });

    test(`${DateRangesEnum.LAST_MONTH} :: Date range over the last 30 day period`, () => {
      expect(DateRanges.toDates(DateRangesEnum.LAST_MONTH)).toEqual({
        since: new Date('2019-09-20'),
        until: new Date('2019-10-19T23:59:59.999Z'),
      });
    });

    test(`${DateRangesEnum.LAST_12_MONTHS} :: Date range over the last 12 months`, () => {
      expect(DateRanges.toDates(DateRangesEnum.LAST_12_MONTHS)).toEqual({
        since: new Date('2018-10-20'),
        until: new Date('2019-10-19T23:59:59.999Z'),
      });
    });
  });

  describe(':: toFormat', () => {
    test(`${DateRangesEnum.THIS_WEEK} :: Day format`, () => {
      expect(DateRanges.toFormat(DateRangesEnum.THIS_WEEK)).toBe('DD MMM');
    });

    test(`${DateRangesEnum.LAST_WEEK} :: Day format`, () => {
      expect(DateRanges.toFormat(DateRangesEnum.LAST_WEEK)).toBe('DD MMM');
    });

    test(`${DateRangesEnum.LAST_MONTH} :: Week number format`, () => {
      expect(DateRanges.toFormat(DateRangesEnum.LAST_MONTH)).toBe('DD MMM');
    });

    test(`${DateRangesEnum.LAST_12_MONTHS} :: Month format`, () => {
      expect(DateRanges.toFormat(DateRangesEnum.LAST_12_MONTHS)).toBe('MMM YYYY');
    });
  });

  describe(':: toArray', () => {
    test(`${DateRangesEnum.THIS_WEEK} :: range incrementing by day`, () => {
      const since = new Date('2019-10-01');
      const until = new Date('2019-10-05');
      expect(DateRanges.toArray(since, until, DateRangesEnum.THIS_WEEK))
        .toEqual(['01 Oct', '02 Oct', '03 Oct', '04 Oct', '05 Oct']);
    });

    test(`${DateRangesEnum.LAST_WEEK} :: range incrementing by day`, () => {
      const since = new Date('2019-10-01');
      const until = new Date('2019-10-05');
      expect(DateRanges.toArray(since, until, DateRangesEnum.LAST_WEEK))
        .toEqual(['01 Oct', '02 Oct', '03 Oct', '04 Oct', '05 Oct']);
    });

    test(`${DateRangesEnum.LAST_MONTH} :: range incrementing by week`, () => {
      const since = new Date('2019-10-01');
      const until = new Date('2019-11-08');
      expect(DateRanges.toArray(since, until, DateRangesEnum.LAST_MONTH))
        .toEqual(['01 Oct', '08 Oct', '15 Oct', '22 Oct', '29 Oct', '05 Nov']);
    });

    test(`${DateRangesEnum.LAST_12_MONTHS} :: range incrementing by month`, () => {
      const since = new Date('2018-10-01');
      const until = new Date('2019-01-31');
      expect(DateRanges.toArray(since, until, DateRangesEnum.LAST_12_MONTHS))
        .toEqual(['Oct 2018', 'Nov 2018', 'Dec 2018', 'Jan 2019']);
    });
  });

  describe(':: zeroPadObject', () => {
    test(`${DateRangesEnum.LAST_12_MONTHS} :: empty object fully filled with zeros`, () => {
      const since = new Date('2018-10-01');
      const until = new Date('2019-01-31');
      expect(DateRanges.zeroPadObject(since, until, DateRangesEnum.LAST_12_MONTHS, {}))
        .toEqual({
          'Oct 2018': 0,
          'Nov 2018': 0,
          'Dec 2018': 0,
          'Jan 2019': 0,
        });
    });

    test(`${DateRangesEnum.LAST_12_MONTHS} :: partial object filled with zeros, existing entries unchanged`, () => {
      const since = new Date('2018-10-01');
      const until = new Date('2019-01-31');
      const input = { 'Oct 2018': 1 };
      expect(DateRanges.zeroPadObject(since, until, DateRangesEnum.LAST_12_MONTHS, input))
        .toEqual({
          'Oct 2018': 1,
          'Nov 2018': 0,
          'Dec 2018': 0,
          'Jan 2019': 0,
        });
    });
  });
});
