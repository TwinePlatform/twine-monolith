import { useEffect } from 'react';
import { DurationUnitEnum } from '../types';
import { logsToAggregatedData } from '../util/dataManipulation/logsToAggregatedData';
import { TableTypeItem } from '../util/dataManipulation/tableType';

interface Params {
  data: {logs: any, volunteers?: any};
  conditions: any[];
  updateOn: any[];
  columnHeaders: string[];
  setErrors: (x: any) => void;
  setAggData: (x: any) => void;
  unit: DurationUnitEnum;
  tableType: TableTypeItem;

}

export const useCreateAggDataOnRes = ({ data, conditions, updateOn = [], columnHeaders, setErrors, setAggData, unit, tableType }: Params): void => { // tslint:disable:max-line-length
  useEffect(() => {
    if (conditions.every((x: any) => x)) {
      setErrors(null);
      try {
        const aggData = logsToAggregatedData({
          logs: data.logs,
          columnHeaders,
          unit,
          tableType,
          volunteers: data.volunteers,
        });
        setAggData(aggData);
      } catch (error) {
        setErrors({ Table: 'There was an error displaying your data. Please try again' });
      }
    }
  }, updateOn);
};
