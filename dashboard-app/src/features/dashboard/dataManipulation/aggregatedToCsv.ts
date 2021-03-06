import csv from 'fast-csv';
import { pathOr, pipe } from 'ramda';
import { Arrays } from 'twine-util';
import { AggregatedData } from './logsToAggregatedData';
import { DurationUnitEnum } from '../../../types';
import {
  calculateTotalsUsing,
  renameAllNameKeys,
  removeIdInRows,
  abbreviateMonths
} from './util';
import Months from '../../../lib/util/months';
import { Orderable } from '../hooks/useOrderable';


const getStringContainingTotal = (xs: string[]) => xs.find((x) => x.includes('Total'));

export const aggregatedToCsv = async (data: AggregatedData, unit: DurationUnitEnum, orderable: Orderable): Promise<string> =>
  new Promise((resolve, reject) => {
    const { rows } = pipe(
      renameAllNameKeys,
      removeIdInRows,
      calculateTotalsUsing(unit),
      abbreviateMonths(Months.format.verbose)
    )(data);
    const groupBy = data.groupByX;
    const rowKeys = Months.sortFormatted(Object.keys(rows[0]));
    const totalHeader = getStringContainingTotal(rowKeys);
    const monthHeaders = rowKeys.filter((x) => x !== groupBy && x !== totalHeader);
    const headers = totalHeader
      ? [groupBy, totalHeader, ...monthHeaders]
      : [groupBy, ...monthHeaders];

    const sortedRows = Arrays.sort([
      { accessor: pathOr('', [headers[orderable.sortByIndex]]), order: orderable.order },
      { accessor: pathOr('', [groupBy]), order: 'asc' },
    ], rows);

    csv.writeToString(
      sortedRows,
      { headers },
      (err, res) => err ? reject(err) : resolve(res));
  });
