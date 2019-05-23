import moment from 'moment';
import DatePickerConstraints from '../datePickerConstraints';


describe('Activity view date-picker constraints', () => {
  describe('from', () => {
    test('No dates before Jan 2017', () => {
      const date = DatePickerConstraints.from.min(new Date, new Date); // inputs unimportant here
      expect(moment('2017-01-01').isSame(date)).toBe(true);
    });
    test('No future dates', () => {
      const date = DatePickerConstraints.from.max(new Date, new Date); // inputs unimportant here
      expect(moment().startOf('day').isSameOrBefore(date)).toBe(true);
    });
    test('from < to is OK: transformed to start of day', () => {
      const from = moment().subtract(1, 'day');
      const to = moment();
      const date = DatePickerConstraints.from.validate(from.toDate(), to.toDate());
      expect(from.startOf('day').isSame(date)).toBe(true);
    });
    test('from > to is OK: transformed to start of day', () => {
      // "OK" in the sense that the `from` date remains valid. The `to` date is
      // transformed in the `to.validate` function
      const from = moment();
      const to = moment().subtract(1, 'day');
      const date = DatePickerConstraints.from.validate(from.toDate(), to.toDate());
      expect(from.startOf('day').isSame(date)).toBe(true);
    });
    test('default value: 30 days ago', () => {
      const date = DatePickerConstraints.from.default();
      expect(moment().subtract(30, 'days').startOf('day').isSame(date)).toBe(true);
    });
  });

  describe('to', () => {
    test('No dates before Jan 2017', () => {
      const date = DatePickerConstraints.to.min(new Date('2016-10-10'), new Date);
      expect(moment('2017-01-01').isSame(date)).toBe(true);
    });
    test('No dates before "from"', () => {
      const date = DatePickerConstraints.to.min(new Date('2018-11-22'), new Date);
      expect(moment('2018-11-22').isSame(date)).toBe(true);
    });
    test('No future dates', () => {
      const date = DatePickerConstraints.to.max(new Date, new Date); // inputs unimportant here
      expect(moment().startOf('day').isSameOrBefore(date)).toBe(true);
    });
    test('from < to is OK: transformed to end of day', () => {
      const from = moment().subtract(1, 'day');
      const to = moment();
      const date = DatePickerConstraints.to.validate(from.toDate(), to.toDate());
      expect(to.endOf('day').isSame(date)).toBe(true);
    });
    test('from > to is not OK: default to from, transformed to end of day', () => {
      const from = moment();
      const to = moment().subtract(1, 'day');
      const date = DatePickerConstraints.to.validate(from.toDate(), to.toDate());
      expect(from.endOf('day').isSame(date)).toBe(true);
    });
    test('default value: now', () => {
      const date = DatePickerConstraints.to.default();
      expect(moment().endOf('day').isSame(date)).toBe(true);
    });
  });
});
