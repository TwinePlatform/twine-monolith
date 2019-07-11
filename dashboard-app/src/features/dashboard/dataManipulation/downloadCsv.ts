import moment from 'moment';
import { aggregatedToCsv } from './aggregatedToCsv';
import Months from '../../../lib/util/months';
import { saveAs } from 'file-saver';
import { AggregatedData, isDataEmpty } from './logsToAggregatedData';
import { DurationUnitEnum } from '../../../types';
import { Order } from 'twine-util/arrays';
import { Orderable } from '../hooks/useOrderable';


interface Params {
  fileName: string;
  data: AggregatedData;
  fromDate: Date;
  toDate: Date;
  unit: DurationUnitEnum;
  // sortBy: number;
  // order?: Order;
  orderable: Orderable;
}

// tslint:disable-next-line: max-line-length
export const downloadCsv = async ({ data: aggData, fromDate, toDate, fileName, unit, orderable }: Params) => {
  if (isDataEmpty(aggData)) {
    throw new Error('No data available to download');
  }

  try {
    const csv = await aggregatedToCsv(aggData, unit, orderable);
    const from = moment(fromDate).format(Months.format.filename);
    const to = moment(toDate).format(Months.format.filename);
    const file = new File([csv], `${fileName}_${from}-${to}.csv`, {
      type: 'text/plain;charset=utf-8',
    });
    // saveAs(file);
    console.log(csv);


  } catch (error) {
    throw new Error('There was a problem downloading your data');

  }
};
