import { useEffect } from 'react';
import { logsToAggregatedData } from '../dashboard/dataManipulation/logsToAggregatedData';
import { TableTypeItem } from '../dashboard/dataManipulation/tableType';

interface Params {
  data: {logs: any, volunteers?: any};
  conditions: any[];
  updateOn: any[];
  columnHeaders: string[];
  setErrors: (x: any) => void;
  setAggData: (x: any) => void;
  tableType: TableTypeItem;

}

export const useAggDataOnRes = ({ data, conditions, updateOn = [], columnHeaders, setErrors, setAggData, tableType }: Params): void => { // tslint:disable:max-line-length
  useEffect(() => {
    if (conditions.every((x: any) => x)) {
      setErrors(null);
      try {
        const aggData = logsToAggregatedData({
          logs: data.logs,
          columnHeaders,
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
