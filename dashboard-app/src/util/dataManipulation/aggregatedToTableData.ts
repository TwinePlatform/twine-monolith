import { evolve, map, pipe, merge, toPairs, fromPairs } from 'ramda';
import moment from 'moment';
import { DataTableProps } from '../../components/DataTable/types';
import { AggregatedData } from './logsToAggregatedData';
import Months from '../months';

interface Params {
  title: string;
  sortBy: string;
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

export const aggregatedToTableData = ({ title, data, sortBy }: Params) => {
  return pipe(
    abbreviateMonths,
    addContentObjects,
    addColumnsKey,
    merge({ title, sortBy })
    )(data as any) as DataTableProps;
};

