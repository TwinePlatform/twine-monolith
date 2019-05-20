import { evolve, map, pipe, merge } from 'ramda';
import { DataTableProps } from '../../components/DataTable/types';
import { AggregatedData } from './logsToAggregatedData';

interface Params {
  title: string;
  data: AggregatedData;
}

const addContentObjects = evolve({
  rows: map(map((y: any) => ({ content: y }))),
});

const addColumnsKey = evolve({
  rows: map((x) => ({ columns: x })),
});

export const aggregatedToTableData = ({ title, data }: Params) => {
  return pipe(
    addContentObjects,
    addColumnsKey,
    merge({ title })
    )(data as any) as DataTableProps;
};
