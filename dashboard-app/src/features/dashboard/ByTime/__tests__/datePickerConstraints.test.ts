import moment from 'moment';
import DatePickerConstraints from '../datePickerConstraints';


describe('Time view date-picker constraints', () => {
  describe('from', () => {
    test('No dates before Jan 2017', () => {
      const date = DatePickerConstraints.from.min(new Date, new Date); // inputs unimportant here
      expect(moment('2017-01-01').isSame(date)).toBe(true);
    });
    test('No future dates', () => {
      const date = DatePickerConstraints.from.max(new Date, new Date); // inputs unimportant here
      expect(moment().startOf('month').isSameOrBefore(date)).toBe(true);
    });
    test('from < to is OK: transformed to start of month', () => {
      const from = moment().subtract(1, 'month');
      const to = moment();
      const date = DatePickerConstraints.from.validate(from.toDate(), to.toDate());
      expect(from.startOf('month').isSame(date)).toBe(true);
    });
    test('from > to is OK: transformed to start of month', () => {
      const from = moment();
      const to = moment().subtract(1, 'month');
      const date = DatePickerConstraints.from.validate(from.toDate(), to.toDate());
      expect(from.startOf('month').isSame(date)).toBe(true);
    });
    test('default value: 11 months ago', () => {
      const date = DatePickerConstraints.from.default();
      expect(moment().subtract(11, 'months').startOf('month').isSame(date)).toBe(true);
    });
  });

  describe('to', () => {
    test('No dates before Jan 2017', () => {
      const date = DatePickerConstraints.to.min(new Date('2016-10-10'), new Date);
      expect(moment('2017-01-01').endOf('month').isSame(date)).toBe(true);
    });
    test('No dates before "from"', () => {
      const date = DatePickerConstraints.to.min(new Date('2018-11-22'), new Date);
      expect(moment('2018-11-22').endOf('month').isSame(date)).toBe(true);
    });
    test('No future dates', () => {
      const date = DatePickerConstraints.to.max(new Date, new Date); // inputs unimportant here
      expect(moment().startOf('day').isSameOrBefore(date)).toBe(true);
    });
    test('No dates further than 11 months after "from"', () => {
      const date = DatePickerConstraints.to.max(new Date('2018-01-01'), new Date);
      expect(moment('2018-12-01').endOf('month').isSame(date)).toBe(true);
    });
    test('from < to is OK: transformed to end of month', () => {
      const from = moment().subtract(1, 'day');
      const to = moment();
      const date = DatePickerConstraints.to.validate(from.toDate(), to.toDate());
      expect(to.endOf('month').isSame(date)).toBe(true);
    });
    test('from > to is not OK: default to from, transformed to end of month', () => {
      const from = moment();
      const to = moment().subtract(1, 'day');
      const date = DatePickerConstraints.to.validate(from.toDate(), to.toDate());
      expect(from.endOf('month').isSame(date)).toBe(true);
    });
    test('default value: now', () => {
      const date = DatePickerConstraints.to.default();
      expect(moment().endOf('month').isSame(date)).toBe(true);
    });
  });
});
