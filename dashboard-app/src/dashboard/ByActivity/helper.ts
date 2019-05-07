import { Duration, MathUtil } from 'twine-util';
import { mergeAll, assocPath, path, propEq, find } from 'ramda';
import { DataTableRow, DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';

interface Params {
  data: any[];
  volunteers: any[];
  activities: string[];
  unit: DurationUnitEnum;
}

const roundToDecimal = MathUtil.roundTo(2);

const toUnitDuration = (unit: DurationUnitEnum, duration: Duration.Duration) => {
  switch (unit){
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

export const activityLogsToTable = ({ data, activities, unit, volunteers }
  : Params): DataTableProps => {
  const rows = data.reduce((acc: DataTableRow[], el: any) => {
    const userExists = acc.some((x: any) => x.columns['Volunteer Name'].content === el.userId);
    // doesn't work for more than 12 months
    const logActivity = el.activity;
    if (userExists) {
      return acc.map((x) => {
        if (Number(x.columns['Volunteer Name'].content) === Number(el.userId)) {
          x.columns[logActivity].content =
            addDurationToTableContents(x, logActivity, unit, el.duration);
          x.columns[`Total ${unit} volunteered`].content =
            addDurationToTableContents(x, `Total ${unit} volunteered`, unit, el.duration);
        }
        return x;
      });
    }
    const activitiesContent = activities.map((a: string) => ({ [a]: { content: 0 } }));
    const newRow = {
      columns: {
        ['Volunteer Name']: { content: el.userId, },
        [`Total ${unit} volunteered`]: { content: 0 },
        ...mergeAll(activitiesContent),
        [el.activity]: { content: toUnitDuration(unit, el.duration) },
        [`Total ${unit} volunteered`]: { content: toUnitDuration(unit, el.duration) },
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
    title: 'Volunteer Data By Activity',
    headers: ['Volunteer Name', `Total ${unit} volunteered`, ...activities],
    rows,
  };
};
