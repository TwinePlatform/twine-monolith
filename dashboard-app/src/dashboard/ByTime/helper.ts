import moment from 'moment';
import { DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { logsToRows } from '../../util/tableManipulation';

interface Params { data: any[]; columnHeaders: string[]; unit: DurationUnitEnum; }

const getColumnId = (x: any) => moment(x.startedAt || x.createdAt).format('MMMM');

export const timeLogsToTable = ({ data, columnHeaders, unit }: Params): DataTableProps => {
  const [firstColumn, ...columnRest] = columnHeaders;
  const rows = logsToRows(data, columnHeaders, unit, 'activity', getColumnId);

  return {
    title: 'Volunteer Activity over Months',
    headers: [firstColumn, `Total ${unit}`, ...columnRest],
    rows,
  };
};
