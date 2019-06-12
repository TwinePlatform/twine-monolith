import csv from 'fast-csv';
import { pipe } from 'ramda';
import { AggregatedData } from './logsToAggregatedData';
import { DurationUnitEnum } from '../../types';
import {
  calculateTotalsUsing,
  renameAllNameKeys,
  removeIdInRows,
  abbreviateMonths
} from './util';
import Months from '../../util/months';


// tslint:disable-next-line: max-line-length
export const aggregatedToCsv = async (data: AggregatedData, unit: DurationUnitEnum): Promise<string> =>
  new Promise((resolve, reject) => {
    const { rows } = pipe(
      renameAllNameKeys,
      removeIdInRows,
      calculateTotalsUsing(unit),
      abbreviateMonths(Months.format.verbose)
    )(data);

    // TODO reorder columns to avoid depending on object property order
    csv.writeToString(
      rows,
      { headers: true },
      (err, res) => err ? reject(err) : resolve(res));
  });
