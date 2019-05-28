import csv from 'fast-csv';
import { Objects } from 'twine-util';
import { AggregatedData } from './logsToAggregatedData';
import { DurationUnitEnum } from '../../types';
import { abbreviateIfDateString, calculateTotalsUsing } from './util';


// tslint:disable-next-line: max-line-length
export const aggregatedToCsv = async (data: AggregatedData, unit: DurationUnitEnum): Promise<string> =>
  new Promise((resolve, reject) => {
    const { rows } = calculateTotalsUsing(unit)(data);
    const csvData = rows.map((row) => Objects.mapKeys(abbreviateIfDateString)(row));

    // TODO reorder columns to avoid depending on object property order
    csv.writeToString(csvData, { headers: true }, (err, res) => err ? reject(err) : resolve(res));
  });
