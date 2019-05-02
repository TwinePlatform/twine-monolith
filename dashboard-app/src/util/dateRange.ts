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
};

export default DateRange;
