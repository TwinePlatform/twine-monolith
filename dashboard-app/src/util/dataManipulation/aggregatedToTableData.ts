import { evolve, map, pipe, merge, toPairs, fromPairs } from 'ramda';
import moment from 'moment';
import { Duration, MathUtil, Objects } from 'twine-util';
import { DataTableProps } from '../../components/DataTable/types';
import { AggregatedData } from './logsToAggregatedData';
import Months from '../months';
import { DurationUnitEnum } from '../../types';

interface Params {
  title: string;
  sortBy: string;
  unit: DurationUnitEnum;
  data: AggregatedData;
}

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

const abbreviateIfDateString = (x: any): string => isDateString(x) ? abbreviateDateString(x) : x;

const addContentObjects = evolve({
  rows: map(map((y: any) => ({ content: y }))),
});

const addColumnsKey = evolve({
  rows: map((x) => ({ columns: x })),
});

const abbreviateMonths = evolve({
  headers: map(abbreviateIfDateString),
  rows: pipe(
    map(toPairs as any),
    map(map(map(abbreviateIfDateString))) as any,
    map(fromPairs)
  ),
});

const roundToDecimal = MathUtil.roundTo(2);


const toUnitDuration = (unit: DurationUnitEnum, duration: Duration.Duration) => {
  switch (unit){
    case DurationUnitEnum.DAYS:
      return roundToDecimal(Duration.toWorkingDays(duration));

    case DurationUnitEnum.HOURS:
      return roundToDecimal(Duration.toHours(duration));
  }
};

const add = (a: number, b: any) => a + (isNaN(b) ? 0 : Number(b));

export const calculateTotalsUsing = (unit: DurationUnitEnum) => evolve({
  rows: (rows: AggregatedData['rows']) => rows.map((row) => ({
    ...row,
    [`Total ${unit}`]: Objects.reduceValues(add, 0, row),
  })),
});

export const aggregatedToTableData = ({ title, data, sortBy, unit }: Params) => {
  return pipe(
    abbreviateMonths,
    addContentObjects,
    addColumnsKey,
    calculateTotalsUsing(unit) as any,
    merge({ title, sortBy })
    )(data as any) as DataTableProps;
};

