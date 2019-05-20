import csv from 'fast-csv';
import { AggregatedData } from './logsToAggregatedData';

export const aggregatedToCsv = async (aggData: AggregatedData): Promise<string> => {
  return new Promise((resolve, reject) => {
    // TODO reorder columns to avoid depending on object property order
    csv.writeToString(aggData.rows, { headers: true }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
