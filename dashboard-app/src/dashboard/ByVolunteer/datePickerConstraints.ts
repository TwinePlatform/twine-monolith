import moment from 'moment';
import { DateRangePickerConstraint } from '../../components/DatePicker/types';

// Date rules:
// all:
// 1. no future dates for either from or to
// 2. from < to
// 3. from >= 01 Jan 2017
//
// volunteer:
// 7. month picker
// 8. min diff (to - from) = 0
// 9. max diff (to - from) = 11
// 10. default from: 11 months ago
// 11. default to: now
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

const MIN_DATE = moment('2017-01-01');


export const VolunteerConstraints: DateRangePickerConstraint = {
  from: {
    min: () => MIN_DATE.toDate(),
    max: () => moment().startOf('month').toDate(),
    default: () => moment().subtract(11, 'months').startOf('month').toDate(),
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
    min: (from, to) => moment.max(MIN_DATE, moment(from)).endOf('month').toDate(),
    max: (from, to) => moment.min(moment(), moment(from).add(11, 'months').endOf('month')).toDate(),
    default: () => moment().endOf('month').toDate(),
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

export default VolunteerConstraints;
