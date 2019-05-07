import { Duration, MathUtil } from 'twine-util';
import moment from 'moment';
import { mergeAll, assocPath, path, propEq, find } from 'ramda';
import { DataTableRow, DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';


interface Params {
  data: any[];
  volunteers: any[];
  months: string[];
  unit: DurationUnitEnum;
}

const roundToDecimal = MathUtil.roundTo(2);
const toUnitDuration = (unit: DurationUnitEnum, duration: Duration.Duration) => {
  switch (unit) {
    case DurationUnitEnum.DAYS:
      return roundToDecimal(Duration.toWorkingDays(duration));

    case DurationUnitEnum.HOURS:
      return roundToDecimal(Duration.toHours(duration));
  }
};

const addDurationToTableContents = (
  row: DataTableRow,
  columnKey: string,
  unit: DurationUnitEnum,
  duration: Duration.Duration) =>
    roundToDecimal(Number(row.columns[columnKey].content) + toUnitDuration(unit, duration));

export const volunteerLogsToTable = ({ data, months, unit, volunteers }
  : Params): DataTableProps => {
  const rows = data.reduce((acc: DataTableRow[], el: any) => {
    const userExists = acc.some((x: any) => x.columns['Volunteer Name'].content === el.userId);
    // doesn't work for more than 12 months
    const logMonth = moment(el.startedAt || el.createdAt).format('MMMM');
    if (userExists) {
      return acc.map((x) => {
        if (Number(x.columns['Volunteer Name'].content) === Number(el.userId)) {
          x.columns[logMonth].content =
            addDurationToTableContents(x, logMonth, unit, el.duration);
          x.columns[`Total ${unit}`].content =
            addDurationToTableContents(x, `Total ${unit}`, unit, el.duration);
        }
        return x;
      });
    }
    const monthsContent = months.map((a: string) => ({ [a]: { content: 0 } }));
    const newRow = {
      columns: {
        ['Volunteer Name']: { content: el.userId, },
        ...mergeAll(monthsContent),
        [logMonth]: { content: toUnitDuration(unit, el.duration) },
        [`Total ${unit}`]: { content: toUnitDuration(unit, el.duration) },
      },
    };
    return acc.concat(newRow);
  }, [])
  // add volunteers names
  .map((row) => {
    const nestedPath = ['columns', 'Volunteer Name', 'content'];
    const id = path(nestedPath, row);
    const user = find(propEq('id', id), volunteers);
    return assocPath(nestedPath, user.name, row);
  });
  return {
    title: 'Data By Volunteer',
    headers: ['Volunteer Name', `Total ${unit}`, ...months],
    rows,
  };
};
