import { Duration, MathUtil } from 'twine-util';
import moment from 'moment';
import { mergeAll, assocPath, path, propEq, find } from 'ramda';
import { DataTableRow, DataTableProps } from '../../components/DataTable/types';
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
  // const rows = data.reduce((acc: DataTableRow[], el: any) => {
  //   const userExists = acc.some((x: any) => x.columns['Volunteer Name'].content === el.userId);
  //   // doesn't work for more than 12 months
  //   const logMonth = moment(el.startedAt || el.createdAt).format('MMMM');
  //   if (userExists) {
  //     return acc.map((x) => {
  //       if (Number(x.columns['Volunteer Name'].content) === Number(el.userId)) {
  //         x.columns[logMonth].content =
  //           addDurationToTableContents(x, logMonth, unit, el.duration);
  //         x.columns[`Total ${unit}`].content =
  //           addDurationToTableContents(x, `Total ${unit}`, unit, el.duration);
  //       }
  //       return x;
  //     });
  //   }
  //   const monthsContent = months.map((a: string) => ({ [a]: { content: 0 } }));
  //   const newRow = {
  //     columns: {
  //       ['Volunteer Name']: { content: el.userId, },
  //       ...mergeAll(monthsContent),
  //       [logMonth]: { content: toUnitDuration(unit, el.duration) },
  //       [`Total ${unit}`]: { content: toUnitDuration(unit, el.duration) },
  //     },
  //   };
  //   return acc.concat(newRow);
  // }, [])
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
