import moment from 'moment';
import { aggregatedToCsv } from './aggregatedToCsv';
import Months from '../months';
import { saveAs } from 'file-saver';
import { AggregatedData } from './logsToAggregatedData';
import { Dictionary } from 'ramda';

interface Params {
  fileName: string;
  aggData: AggregatedData;
  fromDate: Date;
  toDate: Date;
  setErrors: (x: Dictionary<string>) => void;
}

export const downloadCsv = (({ aggData, fromDate, toDate, setErrors, fileName }: Params) => {
  return (async () => {
    try {
      const csv = await aggregatedToCsv(aggData);
      const from = moment(fromDate).format(Months.format.filename);
      const to = moment(toDate).format(Months.format.filename);
      const file = new File([csv], `${fileName}_${from}-${to}.csv`, {
        type: 'text/plain;charset=utf-8',
      });
      saveAs(file);
    } catch (error) {
      setErrors({ Download: 'There was a problem downloading your data' });
    }
  });
});
