import { evolve, map, pipe, toPairs, fromPairs, omit } from 'ramda';
import { DataTableProps } from '../../components/DataTable/types';
import { AggregatedData, Row } from './logsToAggregatedData';
import { DurationUnitEnum } from '../../types';
import { abbreviateIfDateString, calculateTotalsUsing } from './util';
import Months from '../../util/months';
import { renameKeys } from 'twine-util/objects';


interface Params {
  unit: DurationUnitEnum;
  data: AggregatedData;
  yData: { name: string }[];
}
export type TableData = Pick<DataTableProps, 'headers' | 'rows'>;

const createHeaders = (yData: {name: string}[]) => (data: AggregatedData) => {
  const headers = [data.groupByX, ...yData.map((x) => x.name)];
  return { ...data, headers };
};

const renameAllNameKeys = (data: AggregatedData) => {
  const newRows = data.rows.map(renameKeys({ name: data.groupByX }));
  return { ...data, rows: newRows };
};

const removeIdInRows = (data: AggregatedData) => {
  const newRows = data.rows.map(omit(['id']));
  return { ...data, rows: newRows };
};

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

export const aggregatedToTableData = ({ data, unit, yData }: Params) => {
  return pipe(
    createHeaders(yData),
    renameAllNameKeys,
    removeIdInRows,
    calculateTotalsUsing(unit),
    abbreviateMonths,
    addContentObjects as any,
    addColumnsKey
  )(data) as Pick<DataTableProps, 'headers' | 'rows'>;
};
