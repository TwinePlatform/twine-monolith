import csv from 'fast-csv';
import { AggregatedData } from './logsToAggregatedData';
import { calculateTotalsUsing } from './aggregatedToTableData';
import { DurationUnitEnum } from '../../types';


// tslint:disable-next-line: max-line-length
export const aggregatedToCsv = async (data: AggregatedData, unit: DurationUnitEnum): Promise<string> =>
  new Promise((resolve, reject) => {
    const { rows } = calculateTotalsUsing(unit)(data);

    // TODO reorder columns to avoid depending on object property order
    csv.writeToString(rows, { headers: true }, (err, data) => err ? reject(err) : resolve(data));
  });
