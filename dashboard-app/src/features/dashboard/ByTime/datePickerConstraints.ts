import moment from 'moment';
import { DateRangePickerConstraint, MIN_DATE } from '../components/DatePicker/types';

// Date rules:
//
// - min from: 01 Jan 2017
// - max from: now
//
// - min to: 01 Jan 2017
// - max to: now
//
// - default from: 11 months ago
// - default to: now
//
// - validate:
//   - from:
//     - (from < to) || from
//     - (to - from <= 11 months) || from
//   - to:
//     - (from < to) || from
//     - (to - from <= 11 months) || from + 11 months


const TimeConstraints: DateRangePickerConstraint = {
  from: {
    min: () => MIN_DATE.toDate(),
    max: () => moment().startOf('month').toDate(),
    default: () => moment().subtract(11, 'months').startOf('month').toDate(),
    validate: (_from, _to) => moment(_from).startOf('month').toDate(),
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

export default TimeConstraints;
