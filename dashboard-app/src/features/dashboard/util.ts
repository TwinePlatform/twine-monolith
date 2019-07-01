import moment from 'moment';
import Months from '../../lib/util/months';
import { TitleString } from './components/Title';

export const getTitleForMonthPicker = (title: string, from: Date, to: Date): TitleString => {
  const dateRangeString = `${moment(from).format(Months.format.abreviated)} -\
  ${moment(to).format(Months.format.abreviated)}`;

  return [
    title,
    dateRangeString,
  ];
};

const dayFormat = 'Do MMM YYYY';

export const getTitleForDayPicker = (title: string, from: Date, to: Date): TitleString => {
  const dateRangeString = `${moment(from).format(dayFormat)} -\
  ${moment(to).format(dayFormat)}`;

  return [
    title,
    dateRangeString,
  ];
};

