import moment from 'moment';
import Months from '../util/months';

export const getTitleForMonthPicker = (title: string, from: Date, to: Date) =>
  `${title}: \
    ${moment(from).format(Months.format.abreviated)} -\
    ${moment(to).format(Months.format.abreviated)}`;

const dayFormat = 'Do MMM YYYY';

export const getTitleForDayPicker = (title: string, from: Date, to: Date) =>
  `${title}: \
    ${moment(from).format(dayFormat)} -\
    ${moment(to).format(dayFormat)}`;
