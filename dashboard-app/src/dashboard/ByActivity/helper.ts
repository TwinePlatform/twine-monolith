import { assocPath, path, propEq, find, Dictionary } from 'ramda';
import { DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { logsToAggregatedData } from '../../util/dataManipulation/logsToAggregatedData';
import { aggregatedToTableData } from '../../util/dataManipulation/aggregatedToTableData';

interface Params {
  data: { logs: any, volunteers: any};
  activities: string[];
  unit: DurationUnitEnum;
  setErrors: (d: Dictionary<string>) => void;
}

export const logsToActivityTable = ({ data, activities: columnRest, unit, setErrors }
  : Params): DataTableProps | null => {
  try {

    const firstColumn = 'Volunteer Name';
    const columnHeaders = [firstColumn, ...columnRest];
    const aggData = logsToAggregatedData({
      logs: data.logs,
      columnHeaders,
      unit,
      rowIdFromLogs: 'userId',
      getColumnIdFromLogs: (x) => x.activity,
      volunteers: data.volunteers,
    });
    const tableData =
      aggregatedToTableData({ title: 'Volunteer Data By Activity', data: aggData });

    return tableData;
  } catch (e) {
    setErrors({ Table: 'There was an error displaying your data. Please try again' });
    return null;
  }
};
