import moment from 'moment';
import { assocPath, path, propEq, find } from 'ramda';
import { DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { logsToRows } from '../../util/tableManipulation';


interface Params {
  data: { logs: any, volunteers: any};
  columnHeaders: string[];
  unit: DurationUnitEnum;
}

const getColumnId = (x: any) => moment(x.startedAt || x.createdAt).format('MMMM');

export const volunteerLogsToTable = ({ data, columnHeaders, unit }
  : Params): DataTableProps => {
  const [firstColumn, ...columnRest] = columnHeaders;
  const rows = logsToRows(data.logs, columnHeaders, unit, 'userId', getColumnId)
  // add volunteers names
  .map((row) => {
    const nestedPath = ['columns', 'Volunteer Name', 'content'];
    const id = path(nestedPath, row);
    const user = find(propEq('id', id), data.volunteers);
    return assocPath(nestedPath, user.name, row);
  });
  return {
    title: 'Data By Volunteer',
    headers: [firstColumn, `Total ${unit}`, ...columnRest],
    rows,
  };
};
