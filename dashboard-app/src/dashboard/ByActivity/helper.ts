import { assocPath, path, propEq, find } from 'ramda';
import { DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { logsToRows } from '../../util/tableManipulation';

interface Params {
  data: { logs: any, volunteers: any};
  columnHeaders: string[];
  unit: DurationUnitEnum;
}

export const activityLogsToTable = ({ data, columnHeaders, unit }
  : Params): DataTableProps => {
  const [firstColumn, ...columnRest] = columnHeaders;
  const rows = logsToRows(data.logs, columnHeaders, unit, 'userId', (x) => x.activity)
  // replace userId with name
  .map((row) => {
    const nestedPath = ['columns', firstColumn, 'content'];
    const id = path(nestedPath, row);
    const user = find(propEq('id', id), data.volunteers);
    return assocPath(nestedPath, user.name, row);
  });
  return {
    title: 'Volunteer Data By Activity',
    headers: [firstColumn, `Total ${unit}`, ...columnRest],
    rows,
  };
};
