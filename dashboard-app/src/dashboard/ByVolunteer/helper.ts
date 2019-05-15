import moment from 'moment';
import { assocPath, path, propEq, find, Dictionary } from 'ramda';
import { DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { logsToAggregatedData } from '../../util/dataManipulation/logsToAggregatedData';
import Months from '../../util/months';
import { aggregatedToTableData } from '../../util/dataManipulation/aggregatedToTableData';


interface Params {
  data: { logs: any, volunteers: any};
  unit: DurationUnitEnum;
  fromDate: Date;
  toDate: Date;
  setErrors: (d: Dictionary<string>) => void;
}

const getColumnId = (x: any) => moment(x.startedAt || x.createdAt).format(Months.format);

export const logsToVolunteerTable = ({ data, unit, fromDate, toDate, setErrors }
  : Params): DataTableProps | null => {
  try {
    const firstColumn = 'Volunteer Name';
    const columnRest = Months.range(fromDate, toDate);
    const columnHeaders = [firstColumn, ...columnRest];
    const aggData = logsToAggregatedData({
      logs: data.logs,
      columnHeaders,
      unit,
      rowIdFromLogs: 'userId',
      getColumnIdFromLogs: getColumnId,
      volunteers: data.volunteers,
    });
    const tableData = aggregatedToTableData({ title: 'Data By Volunteer', data: aggData });

    return tableData;
  } catch (e) {
    setErrors({ Table: 'There was an error displaying your data. Please try again' });
    return null;
  }
};
