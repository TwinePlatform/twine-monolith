import moment from 'moment';
import { DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { logsToRows } from '../../util/tableManipulation';
import Months from '../../util/months';

interface Params {
  data: any[];
  unit: DurationUnitEnum;
  fromDate: Date;
  toDate: Date;
}

const getColumnId = (x: any) => moment(x.startedAt || x.createdAt).format(Months.format);

export const logsToTimeTable = ({ data, unit, fromDate, toDate }: Params): DataTableProps => {
  const firstColumn = 'Activity';
  const columnRest = Months.range(fromDate, toDate);
  const columnHeaders = [firstColumn, ...columnRest];
  const rows = logsToRows(data, columnHeaders, unit, 'activity', getColumnId);

  return {
    title: 'Volunteer Activity over Months',
    headers: [firstColumn, `Total ${unit}`, ...columnRest],
    rows,
  };
};
