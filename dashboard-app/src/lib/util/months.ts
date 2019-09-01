import moment from 'moment';

export enum MonthsFormatEnum {
  verbose = 'MMMM YYYY',
  abreviated = 'MMM YYYY',
  filename = 'MM_YY',
}

interface Months {
  list: string[];
  format: typeof MonthsFormatEnum;
  range: (from: Date, to: Date, format: MonthsFormatEnum) => string[];
  diff: (from: Date, to: Date) => number;
  formattedToDate: (s: string) => Date;
  sortFormatted: (ms: string[]) => string[];
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
  formattedToDate: (str) => {
    const d = new Date(`01-${str}`);

    if (isNaN(d.valueOf())) {
      throw new Error('Invalid date');
    }

    return d;
  },
  sortFormatted: (mthStrs) => {
    return mthStrs.sort((a, b) => {
      try {
        const ad = months.formattedToDate(a)
        const bd = months.formattedToDate(b);
        return ad < bd ? -1 : ad > bd ? 1 : 0;
      } catch (error) {
        return 0;
      }
    })
  }
};

export default months;
