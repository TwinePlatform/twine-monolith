import moment from 'moment';
import { aggregatedToCsv } from './aggregatedToCsv';
import Months from '../../util/months';
import { saveAs } from 'file-saver';
import { AggregatedData, isDataEmpty } from './logsToAggregatedData';
import { Dictionary } from 'ramda';
import { DurationUnitEnum } from '../../types';


interface Params {
  fileName: string;
  data: AggregatedData;
  fromDate: Date;
  toDate: Date;
  setErrors: (x: Dictionary<string>) => void;
  unit: DurationUnitEnum;
}

// tslint:disable-next-line: max-line-length
export const downloadCsv = async ({ data: aggData, fromDate, toDate, setErrors, fileName, unit }: Params) => {
  try {
    const csv = await aggregatedToCsv(aggData, unit);
    const from = moment(fromDate).format(Months.format.filename);
    const to = moment(toDate).format(Months.format.filename);
    const file = new File([csv], `${fileName}_${from}-${to}.csv`, {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(file);
  } catch (error) {
    if (isDataEmpty(aggData)) {
      setErrors({ Download: 'There is no data available to download' });
    } else {
      setErrors({ Download: 'There was a problem downloading your data' });
    }
  }
};
