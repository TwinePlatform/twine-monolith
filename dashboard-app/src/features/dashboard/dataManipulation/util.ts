import moment from 'moment';
import { evolve, curry, omit, Dictionary } from 'ramda';
import { Duration, MathUtil, Objects } from 'twine-util';
import { DurationUnitEnum } from '../../../types';
import { AggregatedData } from './logsToAggregatedData';
import Months, { MonthsFormatEnum } from '../../../lib/util/months';
import { renameKeys } from 'twine-util/objects';


export const isDateString = (x: any): boolean => {
  if (typeof x !== 'string') return false;
  const words = x.split(' ');
  if (words.length !== 2) return false;
  if (isNaN(Number(words[1]))) return false;
  return Months.list.includes(words[0]);
};

export const abbreviateDateString = curry((format: MonthsFormatEnum, x: string): string => {
  const [month, year] = x.split(' ');
  const numericalMonth = Months.list.indexOf(month) + 1;
  const doubleDigitNumericalMonth = numericalMonth > 9
    ? `${numericalMonth}`
    : `0${numericalMonth}`;
  const isoDate = `${year}-${doubleDigitNumericalMonth}`;
  return moment(isoDate).format(format);
});

export const abbreviateIfDateString = curry((format: MonthsFormatEnum, x: any): string =>
  isDateString(x) ? abbreviateDateString(format, x) : x);

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
    return Object.assign(
      { [`Total ${unit}`]: round(Objects.reduceValues(add, 0, _row)) },
      _row
    );
  }),
});

export const renameAllNameKeys = (data: AggregatedData) => {
  const newRows = data.rows.map(renameKeys({ name: data.groupByX }));
  return { ...data, rows: newRows };
}; // TODO: add test

export const removeIdInRows = (data: AggregatedData) => {
  const newRows = data.rows.map(omit(['id']));
  return { ...data, rows: newRows };
}; // TODO: add test

export const abbreviateMonths = (format: MonthsFormatEnum) => evolve({
  headers: (headers: string[]) => headers.map((x) => abbreviateIfDateString(format, x)),
  rows: (rows: Dictionary<string | number>[]) => rows
    .map((row) => Objects.mapKeys((k) => abbreviateIfDateString(format, k))(row)),
}); // TODO: add test
