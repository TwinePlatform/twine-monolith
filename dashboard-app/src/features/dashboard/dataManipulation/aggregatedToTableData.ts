import { evolve, map, pipe } from 'ramda';
import { DataTableProps } from '../components/DataTable/types';
import { AggregatedData, IdAndName } from './logsToAggregatedData';
import { DurationUnitEnum } from '../../../types';
import Months from '../../../lib/util/months';
import {
  calculateTotalsUsing,
  renameAllNameKeys,
  removeIdInRows,
  abbreviateMonths,
} from './util';


interface Params {
  unit: DurationUnitEnum;
  data: AggregatedData;
  yData: IdAndName[];
}
export type TableData = Pick<DataTableProps, 'headers' | 'rows'>;

export const createHeaders = (yData: {name: string}[]) => (data: AggregatedData) => {
  const headers = [data.groupByX, ...yData.map((x) => x.name)];
  return { ...data, headers };
}; // TODO: add test

const addContentObjects = evolve({
  rows: map(map((y: any) => ({ content: y }))),
});

const addColumnsKey = evolve({
  rows: map((x) => ({ columns: x })),
});

export const aggregatedToTableData = ({ data, unit, yData }: Params) => {
  return pipe(
    createHeaders(yData),
    renameAllNameKeys,
    removeIdInRows,
    calculateTotalsUsing(unit),
    abbreviateMonths(Months.format.abreviated),
    addContentObjects as any,
    addColumnsKey
  )(data) as Pick<DataTableProps, 'headers' | 'rows'>;
};
