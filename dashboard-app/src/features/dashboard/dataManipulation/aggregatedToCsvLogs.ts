import csv from 'fast-csv';
import { pathOr } from 'ramda';
import { Arrays } from 'twine-util';
import { DurationUnitEnum } from '../../../types';
import Months from '../../../lib/util/months';
import { Orderable } from '../hooks/useOrderable';

interface AggregatedData {
    groupByX: string;
    groupByY: string;
    rows: {
            Name: any;
            Time: any;
            Project: any;
            Activity: any;
            Date: any;
    }[]
  }

  
const getStringContainingTotal = (xs: string[]) => xs.find((x) => x.includes('Total'));

export const aggregatedToCsv = async (data: AggregatedData, unit: DurationUnitEnum, orderable: Orderable): Promise<string> =>
  new Promise((resolve, reject) => {
    /*const { rows } = pipe(
      renameAllNameKeys,
      removeIdInRows,
      calculateTotalsUsing(unit),
      abbreviateMonths(Months.format.verbose)
    )(data);*/
    const {rows} = data;
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
