import { evolve, map, pipe, toPairs, fromPairs } from 'ramda';
import { DataTableProps } from '../../components/DataTable/types';
import { AggregatedData } from './logsToAggregatedData';
import { DurationUnitEnum } from '../../types';
import { abbreviateIfDateString, calculateTotalsUsing } from './util';


interface Params {
  unit: DurationUnitEnum;
  data: AggregatedData;
}

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

export const aggregatedToTableData = ({ data, unit }: Params) => {
  return pipe(
    calculateTotalsUsing(unit),
    abbreviateMonths,
    addContentObjects,
    addColumnsKey
  )(data) as Pick<DataTableProps, 'headers' | 'rows'>;
};
