import csv from 'fast-csv';
import { AggregatedData } from './logsToAggregatedData';

export const aggregatedToCsv = async (aggData: AggregatedData): Promise<string> => {
  return new Promise((resolve, reject) => {
    csv.writeToString(aggData.rows, { headers: true }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
