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


const getStringContainingTotal = (xs: string[]) => xs.find((x) => x.includes('Total'));

// tslint:disable-next-line: max-line-length
export const aggregatedToCsv = async (data: AggregatedData, unit: DurationUnitEnum, sortBy: number): Promise<string> =>
  new Promise((resolve, reject) => {
    const { rows } = pipe(
      renameAllNameKeys,
      removeIdInRows,
      calculateTotalsUsing(unit),
      abbreviateMonths(Months.format.verbose)
    )(data);
    const groupBy = data.groupByX;
    const rowKeys = Object.keys(rows[0]);
    const totalHeader = getStringContainingTotal(rowKeys);
    const monthHeaders = rowKeys.filter((x) => x !== groupBy && x !== totalHeader);
    const headers = totalHeader
      ? [groupBy, totalHeader, ...monthHeaders]
      : [groupBy, ...monthHeaders];

    const sortedRows = Arrays.sort([
      { accessor: pathOr('', [headers[sortBy]]), order: sortBy === 0 ? 'asc' : 'desc' },
      { accessor: pathOr('', [groupBy]), order: 'asc' },
    ], rows);

    csv.writeToString(
      sortedRows,
      { headers },
      (err, res) => err ? reject(err) : resolve(res));
  });
