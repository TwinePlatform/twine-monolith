import moment from 'moment';

interface Months {
  list: string [];
  format: typeof MonthsFormatEnum;
  range: (from: Date, to: Date, format: MonthsFormatEnum) => string [];
  diff: (from: Date, to: Date) => number;
  defaultFrom: () => Date;
  defaultTo: () => Date;
}

enum MonthsFormatEnum {
  verbose= 'MMMM YYYY',
  table= 'MMM YY',
  filename= 'MM_YY',
}

const months: Months = {
  list: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // tslint:disable:max-line-length
  format: MonthsFormatEnum,
  range: (from, to, format) => {
    const length = months.diff(from, to) + 1;
    return [...Array(length)].map((_, i) => moment(from).add(i, 'M').format(format));
  },
  diff: (_from, _to) => {
    const from = moment(_from);
    const to = moment(_to);

    return to.diff(from, 'months');
  },
  defaultFrom: () => moment().subtract(1, 'year').add(1, 'month').startOf('month').toDate(),
  defaultTo: () => moment().endOf('month').toDate(),

};

export default months;
