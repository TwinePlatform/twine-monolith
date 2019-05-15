import moment from 'moment';
import { assocPath, path, propEq, find, Dictionary } from 'ramda';
import { DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { logsToRows } from '../../util/tableManipulation';
import Months from '../../util/months';


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
    const rows = logsToRows(data.logs, columnHeaders, unit, 'userId', getColumnId)
      // add volunteers names
      .map((row) => {
        const nestedPath = ['columns', 'Volunteer Name', 'content'];
        const id = path(nestedPath, row);
        const user = find(propEq('id', id), data.volunteers);
        if (!user) {
          return assocPath(nestedPath, 'Deleted', row);
        }
        return assocPath(nestedPath, user.name, row);
      });
    return {
      title: 'Data By Volunteer',
      headers: [firstColumn, `Total ${unit}`, ...columnRest],
      sortBy: `Total ${unit}`,
      rows,
    };
  } catch (e) {
    setErrors({ Table: 'There was an error displaying your data. Please try again' });
    return null;
  }
};
