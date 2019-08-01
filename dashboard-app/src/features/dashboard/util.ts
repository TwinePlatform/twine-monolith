import moment from 'moment';
import Months from '../../lib/util/months';
import { TitleString } from './components/Title';
import { toggle } from 'twine-util/misc';
import { Order } from 'twine-util/arrays';
import { GraphColourList } from '../../lib/ui/design_system';

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

export const toggleOrder = toggle<Order>('asc', 'desc');

export const getColourByIndex = (i: number) => GraphColourList[i % GraphColourList.length];
