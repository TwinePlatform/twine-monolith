import moment from 'moment';
import { DateRangePickerConstraint } from '../../components/DatePicker/types';

// Date rules:
//
// - min from: 01 Jan 2017
// - max from: now
//
// - min to: 01 Jan 2017
// - max to: now
//
// - default from: 30 days ago
// - default to: now
//
// - validate:
//   - from:
//     - (from < to) || from
//   - to:
//     - (from < to) || from

const MIN_DATE = moment('2017-01-01');


export const ActivityConstraints: DateRangePickerConstraint = {
  from: {
    min: () => MIN_DATE.toDate(),
    max: () => moment().endOf('day').toDate(),
    default: () => moment().subtract(30, 'days').startOf('day').toDate(),
    validate: (_from, _to) => moment(_from).startOf('day').toDate(),
  },

  to: {
    min: (from, to) => moment.max(MIN_DATE, moment(from)).startOf('day').toDate(),
    max: () => moment().endOf('day').toDate(),
    default: () => moment().endOf('day').toDate(),
    validate: (_from, _to) => {
      const from = moment(_from).startOf('day');
      const to = moment(_to).endOf('day');

      return from.isAfter(to)
        ? from.endOf('day').toDate()
        : to.toDate();
    },
  },
};

export default ActivityConstraints;
