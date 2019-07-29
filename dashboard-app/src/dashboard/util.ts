import moment from 'moment';
import Months from '../util/months';
import { GraphColourList } from '../styles/design_system';

export const getTitleForMonthPicker = (title: string, from: Date, to: Date) =>
  `${title}: \
    ${moment(from).format(Months.format.abreviated)} -\
    ${moment(to).format(Months.format.abreviated)}`;

const dayFormat = 'Do MMM YYYY';

export const getTitleForDayPicker = (title: string, from: Date, to: Date) =>
  `${title}: \
    ${moment(from).format(dayFormat)} -\
    ${moment(to).format(dayFormat)}`;


export const getColourByIndex = (i: number) => GraphColourList[i % GraphColourList.length];
