import moment from 'moment';

// Date rules:
// all:
// 1. no future dates for either from or to
// 2. from < to
// 3. from >= 01 Jan 2017
//
// activity:
// 4. day picker
// 5. default from: 30 days ago
// 6. default to: now
//
// time:
// 7. month picker
// 8. min diff (to - from) = 0
// 9. max diff (to - from) = 11
// 10. default from: 11 months ago
// 11. default to: now
//
// volunteer:
// - month picker
// - min diff (to - from) = 0
// - max diff (to - from) = 11
// - default from: 11 months ago
// - default to: now
//
// Activity:
// - min from: 01 Jan 2017     (3)
// - max from: now             (1)
//
// - min to: 01 Jan 2017       (3)
// - max to: now               (1)
//
// - default from: 30 days ago (5)
// - default to: now           (6)
//
// - validate:
//   - from:
//     - from < to || from     (2)
//   - to:
//     - from < to || from     (2)
//
// (1, 2, 3, 4, 5, 6)
//
// Time:
// - min from: 01 Jan 2017       (3)
// - max from: now               (1)
//
// - min to: 01 Jan 2017         (3)
// - max to: now                 (1)
//
// - default from: 11 months ago (10)
// - default to: now             (11)
//
// - validate:
//   - from:
//     - from < to || from       (2, 8)
//     - to - from <= 11 || from (9)
//   - to:
//     - from < to || from       (2, 8)
//     - to - from <= 11 || from + 11 months (9)
//
// (1, 2, 3, 7, 8, 9, 10, 11)
//
// Volunteer:
// - min from: 01 Jan 2017       (3)
// - max from: now               (1)
//
// - min to: 01 Jan 2017         (3)
// - max to: now                 (1)
//
// - default from: 11 months ago (10)
// - default to: now             (11)
//
// - validate:
//   - from:
//     - from < to || from       (2, 8)
//     - to - from <= 11 || from (9)
//   - to:
//     - from < to || from       (2, 8)
//     - to - from <= 11 || from + 11 months (9)
//
// (1, 2, 3, 7, 8, 9, 10, 11)

type DatePickerConfig = {
  min: (from: Date, to: Date) => Date
  max: (from: Date, to: Date) => Date
  default: () => Date
  validate: (from: Date, to: Date) => Date
};

export type DateRangePickerConfig = {
  from: DatePickerConfig
  to: DatePickerConfig
};

const MIN_DATE = moment('2017-01-01');

export const ActivityConfig: DateRangePickerConfig = {
  from: {
    min: () => moment('2017-01-01').toDate(),
    max: () => moment().toDate(),
    default: () => moment().subtract(30, 'days').toDate(),
    validate: (_from, _to) => {
      const from = moment(_from).startOf('day');
      const to = moment(_to).endOf('day');

      if (from.isAfter(to)) {
        return from.toDate();
      }

      return from.toDate();
    },
  },

  to: {
    min: (from, to) => moment.max(MIN_DATE, moment(from)).toDate(),
    max: () => moment().toDate(),
    default: () => moment().toDate(),
    validate: (_from, _to) => {
      const from = moment(_from).startOf('day');
      const to = moment(_to).endOf('day');

      if (from.isAfter(to)) {
        return from.endOf('day').toDate();
      }

      return to.toDate();
    },
  },
};

export const VolunteerConfig: DateRangePickerConfig = {
  from: {
    min: () => moment('2017-01-01').toDate(),
    max: () => moment().toDate(),
    default: () => moment().subtract(11, 'months').toDate(),
    validate: (_from, _to) => {
      const from = moment(_from).startOf('month');
      const to = moment(_to).endOf('month');

      if (from.isAfter(to)) {
        return from.toDate();
      }

      if (to.diff(from, 'months') > 11) {
        return from.toDate();
      }

      return from.toDate();
    },
  },

  to: {
    min: (from, to) => moment.max(MIN_DATE, moment(from)).toDate(),
    max: (from, to) => moment.min(moment(), moment(from).add(11, 'months').endOf('month')).toDate(),
    default: () => moment().toDate(),
    validate: (_from, _to) => {
      const from = moment(_from).startOf('month');
      const to = moment(_to).endOf('month');

      if (from.isAfter(to)) {
        return from.endOf('month').toDate();
      }

      if (to.diff(from, 'months') > 11) {
        return from.add(11, 'months').endOf('month').toDate();
      }

      return to.toDate();
    },
  },
};

export const TimeConfig: DateRangePickerConfig = {
  from: {
    min: () => moment('2017-01-01').toDate(),
    max: () => moment().toDate(),
    default: () => moment().subtract(11, 'months').toDate(),
    validate: (_from, _to) => {
      const from = moment(_from).startOf('month');
      const to = moment(_to).endOf('month');

      if (from.isAfter(to)) {
        return from.toDate();
      }

      if (to.diff(from, 'months') > 11) {
        return from.toDate();
      }

      return from.toDate();
    },
  },

  to: {
    min: (from, to) => moment.max(MIN_DATE, moment(from)).toDate(),
    max: (from, to) => moment.min(moment(), moment(from).add(11, 'months').endOf('month')).toDate(),
    default: () => moment().toDate(),
    validate: (_from, _to) => {
      const from = moment(_from).startOf('month');
      const to = moment(_to).endOf('month');

      if (from.isAfter(to)) {
        return from.endOf('month').toDate();
      }

      if (to.diff(from, 'months') > 11) {
        return from.add(11, 'months').endOf('month').toDate();
      }

      return to.toDate();
    },
  },
};
