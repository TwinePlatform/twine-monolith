import { evolve, map, pipe, toPairs, fromPairs } from 'ramda';
import { DataTableProps } from '../../components/DataTable/types';
import { AggregatedData } from './logsToAggregatedData';
import { DurationUnitEnum } from '../../types';
import { abbreviateIfDateString, calculateTotalsUsing } from './util';
import Months from '../../util/months';


interface Params {
  unit: DurationUnitEnum;
  data: AggregatedData;
}
export type TableData = Pick<DataTableProps, 'headers' | 'rows'>;

const addContentObjects = evolve({
  rows: map(map((y: any) => ({ content: y }))),
});

const addColumnsKey = evolve({
  rows: map((x) => ({ columns: x })),
});

const abbreviateMonths = evolve({
  headers: map((x) => abbreviateIfDateString(Months.format.table, x)),
  rows: pipe(
    map(toPairs as any),
    map(map(map((x) => abbreviateIfDateString(Months.format.table, x)))) as any,
    map(fromPairs)
  ),
});

export const aggregatedToTableData = ({ data, unit }: Params) => {
  return pipe(
    calculateTotalsUsing(unit),
    abbreviateMonths,
    addContentObjects,
    addColumnsKey
  )(data) as Pick<DataTableProps, 'headers' | 'rows'>;
};
