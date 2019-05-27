import csv from 'fast-csv';
import { AggregatedData } from './logsToAggregatedData';
import { aggregatedToTableData } from './aggregatedToTableData';
import { DurationUnitEnum } from '../../types';
import { Objects } from 'twine-util';


// tslint:disable-next-line: max-line-length
export const aggregatedToCsv = async (data: AggregatedData, unit: DurationUnitEnum): Promise<string> =>
  new Promise((resolve, reject) => {
    const tableData = aggregatedToTableData({ data, unit });
    const rows = tableData.rows
      .map((row) =>
        Objects.mapValues((v) => typeof v === 'object' ? v.content : v, row.columns));

    // TODO reorder columns to avoid depending on object property order
    csv.writeToString(rows, { headers: true }, (err, data) => err ? reject(err) : resolve(data));
  });
