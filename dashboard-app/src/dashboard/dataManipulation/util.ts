import moment from 'moment';
import { evolve } from 'ramda';
import { Duration, MathUtil, Objects } from 'twine-util';
import { DurationUnitEnum } from '../../types';
import { AggregatedData } from './logsToAggregatedData';
import Months from '../../util/months';


export const isDateString = (x: any): boolean => {
  if (typeof x !== 'string') return false;
  const words = x.split(' ');
  if (words.length !== 2) return false;
  if (isNaN(Number(words[1]))) return false;
  return Months.list.includes(words[0]);
};

export const abbreviateDateString = (x: string): string => {
  const [month, year] = x.split(' ');
  const numericalMonth = Months.list.indexOf(month) + 1;
  const doubleDigitNumericalMonth = numericalMonth > 9
    ? `${numericalMonth}`
    : `0${numericalMonth}`;
  const isoDate = `${year}-${doubleDigitNumericalMonth}`;
  return moment(isoDate).format(Months.format.table);
};

export const abbreviateIfDateString = (x: any): string =>
  isDateString(x) ? abbreviateDateString(x) : x;

export const round = MathUtil.roundTo(2);

export const add = (a: number, b: any) => a + (isNaN(b) ? 0 : Number(b));

export const toUnitDuration = (unit: DurationUnitEnum, duration: Duration.Duration) => {
  switch (unit){
    case DurationUnitEnum.DAYS:
      return round(Duration.toWorkingDays(duration));

    case DurationUnitEnum.HOURS:
      return round(Duration.toHours(duration));
  }
};

export const calculateTotalsUsing = (unit: DurationUnitEnum) => evolve({
  headers: ([first, ...rest]: string[]) => [first, `Total ${unit}`, ...rest],
  rows: (rows: AggregatedData['rows']) => rows.map((row) => {
    const _row = Objects.mapValues((v) => typeof v === 'object' ? toUnitDuration(unit, v) : v, row);
    return {
      ..._row,
      [`Total ${unit}`]: round(Objects.reduceValues(add, 0, _row)),
    };
  }),
});
