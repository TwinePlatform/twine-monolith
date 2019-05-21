import { sum, transpose } from 'ramda';
import { MathUtil } from 'twine-util';
import { TotalsRowProps, DataTableRow, RowProps } from './types';


export const extractContent = (rows: TotalsRowProps['rows']) =>
  rows.map((row) => row.order.map((h) => row.columns[h].content));

// Had to do this with native maps because map/compose type inference
// ended up being screwy and inferring objects instead of arrays
export const calculateTotals = (rs: TotalsRowProps['rows']) =>
  transpose(extractContent(rs))
    .map((xs) => xs.map(Number))
    .map((xs) => sum(xs))
;

export const toRowProps = (r: DataTableRow, headers: string[]): RowProps =>
  ({
    columns: r.columns,
    order: headers,
  });

export const formatNumber = MathUtil.roundTo(2);
