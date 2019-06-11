import { useEffect } from 'react';
import {
  logsToAggregatedData,
  IdAndName
} from '../dashboard/dataManipulation/logsToAggregatedData';
import { TableTypeItem } from '../dashboard/dataManipulation/tableType';

interface Params {
  data: {logs: any, volunteers?: any};
  conditions: any[];
  updateOn: any[];
  setErrors: (x: any) => void;
  setAggData: (x: any) => void;
  tableType: TableTypeItem;
  xData: IdAndName[];
  yData: IdAndName[];

}

export const useAggDataOnRes = ({ data, conditions, updateOn = [], setErrors, setAggData, tableType, xData, yData }: Params): void => { // tslint:disable:max-line-length
  useEffect(() => {
    if (conditions.every((x: any) => x)) {
      setErrors(null);
      try {
        const aggData = logsToAggregatedData({
          logs: data.logs,
          tableType,
          xData,
          yData,
        });
        setAggData(aggData);
      } catch (error) {
        setErrors({ Table: 'There was an error displaying your data. Please try again' });
      }
    }
  }, updateOn);
};
