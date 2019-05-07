import moment from 'moment';
import { DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { logsToRows } from '../../util/tableManipulation';
import DateRange from '../../util/dateRange';

interface Params {
  data: any[];
  unit: DurationUnitEnum;
  fromDate: Date;
  toDate: Date;
}

const getColumnId = (x: any) => moment(x.startedAt || x.createdAt).format('MMMM');

export const timeLogsToTable = ({ data, unit, fromDate, toDate }: Params): DataTableProps => {
  const startMonth = Number(moment(fromDate).format('M'));
  const duration = DateRange.monthsDifference(fromDate, toDate) + 1;
  const months = DateRange.getPastMonths(startMonth, duration);
  const columnHeaders = ['Volunteer Name'].concat(months);
  const [firstColumn, ...columnRest] = columnHeaders;
  const rows = logsToRows(data, columnHeaders, unit, 'activity', getColumnId);

  return {
    title: 'Volunteer Activity over Months',
    headers: [firstColumn, `Total ${unit}`, ...columnRest],
    rows,
  };
};
