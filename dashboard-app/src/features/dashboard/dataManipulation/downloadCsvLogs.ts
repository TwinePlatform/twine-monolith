import moment from 'moment';
import { aggregatedToCsv } from './aggregatedToCsvLogs';
import Months from '../../../lib/util/months';
import { saveAs } from 'file-saver';
import {isDataEmpty } from './logsToAggregatedData';
import { DurationUnitEnum } from '../../../types';
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

interface Params {
  fileName: string;
  data: AggregatedData;
  fromDate: Date;
  toDate: Date;
  unit: DurationUnitEnum;
  orderable: Orderable;
}

export const downloadCsv = async ({ data: aggData, fromDate, toDate, fileName, unit, orderable }: Params) => {
  if (!aggData) {
    throw new Error('No data available to download');
  }

  try {
    const csv = await aggregatedToCsv(aggData, unit, orderable);
    const from = moment(fromDate).format(Months.format.filename);
    const to = moment(toDate).format(Months.format.filename);
    const file = new File([csv], `${fileName}_${from}-${to}.csv`, {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(file);

  } catch (error) {
    throw new Error('There was a problem downloading your data');

  }
};
