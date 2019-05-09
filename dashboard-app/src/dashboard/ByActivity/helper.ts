import { assocPath, path, propEq, find, Dictionary } from 'ramda';
import { DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { logsToRows } from '../../util/tableManipulation';

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
      sortBy: `Total ${unit}`,
      rows,
    };
  } catch (e) {
    setErrors({ Table: 'There was an error displaying your data. Please try again' });
    return null;
  }
};
