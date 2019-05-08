import moment from 'moment';

const staticMonths = [
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
];

interface DateRange {
  months: string [];
  getPastMonths: (startingMonth: number, numberOfMonths: number, m?: string [])
    => string [];
  monthsDifference: (start: Date, until: Date) => number;
}

const DateRange: DateRange = {
  months: staticMonths,
  getPastMonths: (_startingMonth, numberOfMonths = 12, months = []) => {
    if (_startingMonth > 13) {
      return [];
    }
    if (numberOfMonths < 1) {
      return months;
    }
    const startingMonth = _startingMonth > 12 ? 1 : _startingMonth;
    const newMonths = months.concat(staticMonths[startingMonth - 1]);
    return DateRange.getPastMonths(startingMonth + 1, numberOfMonths - 1, newMonths);
  },
  monthsDifference: (_from, _until) => {
    const from = moment(_from);
    const until = moment(_until);
    if (moment(from).isAfter(until)) {
      return 0;
    }

    return until.diff(from, 'months');
  },
};

export default DateRange;
