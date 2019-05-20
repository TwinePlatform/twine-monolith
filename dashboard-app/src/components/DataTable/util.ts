import { sum, map, filter, compose, complement } from 'ramda';
import { TotalsRowProps, DataTableRow, RowProps } from './types';


export const extract = (rows: TotalsRowProps['rows']) =>
rows.map((row) => row.order.map((h) => row.columns[h].content));

export const transpose = <T>(A: T[][]) =>
A[0].map((col, i) => A.map((row) => row[i]));

const x = map(filter(complement(isNaN)));
const y = filter(complement(isNaN));
const z = complement(isNaN);

export const make = compose(
  map(sum),
  map(filter(complement(isNaN))),
  map(map(Number)),
  transpose,
  extract
);

export const toRowProps = (r: DataTableRow, headers: string[]): RowProps =>
  ({
    columns: r.columns,
    order: headers,
  });
