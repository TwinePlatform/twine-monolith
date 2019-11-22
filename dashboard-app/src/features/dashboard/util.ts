import moment from 'moment';
import Months from '../../lib/util/months';
import { TitleString } from './components/Title';
import { toggle } from 'twine-util/misc';
import { Order } from 'twine-util/arrays';
import { GraphColourList } from '../../lib/ui/design_system';


const getTitleForDatePicker = (fmt: string) => (title: string, from: Date, to: Date): TitleString => [
  title,
  `${moment(from).format(fmt)} - ${moment(to).format(fmt)}`,
];

export const getTitleForDayPicker = getTitleForDatePicker('Do MMM YYYY');
export const getTitleForMonthPicker = getTitleForDatePicker(Months.format.abbreviated);

export const toggleOrder = toggle<Order>('asc', 'desc');

export const getColourByIndex = (i: number, colours = GraphColourList) => colours[i % colours.length];
