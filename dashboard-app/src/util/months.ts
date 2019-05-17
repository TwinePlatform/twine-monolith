import moment from 'moment';

interface Months {
  format: string;
  range: (from: Date, to: Date) => string [];
  diff: (from: Date, to: Date) => number;
  defaultFrom: () => Date;
  defaultTo: () => Date;
}

const Months: Months = {
  format: 'MMMM YY',
  range: (from, to) => {
    const length = Months.diff(from, to) + 1;
    return [...Array(length)].map((_, i) => moment(from).add(i, 'M').format(Months.format)); //tslint:disable-line
  },
  diff: (_from, _to) => {
    const from = moment(_from);
    const to = moment(_to);

    return to.diff(from, 'months');
  },
  defaultFrom: () => moment().subtract(1, 'year').add(1, 'month').startOf('month').toDate(),
  defaultTo: () => moment().startOf('month').toDate(),

};

export default Months;
