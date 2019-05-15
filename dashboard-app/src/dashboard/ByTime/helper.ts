import moment from 'moment';
import { Dictionary } from 'ramda';
import { DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { logsToAggregatedData } from '../../util/dataManipulation/logsToAggregatedData';
import Months from '../../util/months';
import { aggregatedToTableData } from '../../util/dataManipulation/aggregatedToTableData';

interface Params {
  data: any[];
  unit: DurationUnitEnum;
  fromDate: Date;
  toDate: Date;
  setErrors: (d: Dictionary<string>) => void;
}

const getColumnId = (x: any) => moment(x.startedAt || x.createdAt).format(Months.format);

export const logsToTimeTable = ({ data, unit, fromDate, toDate, setErrors }
  : Params): DataTableProps | null => {

  try {

    const firstColumn = 'Activity';
    const columnRest = Months.range(fromDate, toDate);
    const columnHeaders = [firstColumn, ...columnRest];
    const aggData = logsToAggregatedData({
      logs: data,
      columnHeaders,
      unit,
      rowIdFromLogs: 'activity',
      getColumnIdFromLogs: getColumnId,
    });
    const tableData =
      aggregatedToTableData({ title: 'Volunteer Activity over Months', data: aggData });

    return tableData;
  } catch (e) {
    setErrors({ Table: 'There was an error displaying your data. Please try again' });
    return null;
  }
};
