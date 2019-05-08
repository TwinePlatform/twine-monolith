import moment from 'moment';
import { Dictionary } from 'ramda';
import { DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { logsToRows } from '../../util/tableManipulation';
import Months from '../../util/months';

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
    const rows = logsToRows(data, columnHeaders, unit, 'activity', getColumnId);

    return {
      title: 'Volunteer Activity over Months',
      headers: [firstColumn, `Total ${unit}`, ...columnRest],
      sortBy: `Total ${unit}`,
      rows,
    };
  } catch (e) {
    setErrors({ Table: 'There was an error displaying your data. Please try again' });
    return null;
  }
};
