import { Duration, MathUtil } from 'twine-util';
import { mergeAll } from 'ramda';
import moment from 'moment';
import { DataTableRow, DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';

const roundToDecimal = MathUtil.roundTo(2);

interface Params { data: any[]; months: string[]; unit: DurationUnitEnum; }

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

export const timeLogsToTable = ({ data, months, unit }: Params): DataTableProps => {
  const rows = data.reduce((acc: DataTableRow[], el: any) => {
    const activityExists = acc.some((x) => x.columns.Activity.content === el.activity);
    // doesn't work for more than 12 months
    const logMonth = moment(el.startedAt || el.createdAt).format('MMMM');
    if (activityExists) {
      return acc.map((x) => {
        if (x.columns.Activity.content === el.activity) {
          x.columns[logMonth].content = addDurationToTableContents(x, logMonth, unit, el.duration);
          x.columns[`Total ${unit}`].content =
            addDurationToTableContents(x, `Total ${unit}`, unit, el.duration);
        }
        return x;
      });
    }
    const monthsContent = months.map((m: string) => ({ [m]: { content: 0 } }));
    const newRow = {
      columns: {
        Activity: { content: el.activity, },
        [`Total ${unit}`]: { content: 0 },
        ...mergeAll(monthsContent),
        [logMonth]: { content: toUnitDuration(unit, el.duration) },
        [`Total ${unit}`]: { content: toUnitDuration(unit, el.duration) },
      },
    };
    return acc.concat(newRow);
  }, []);

  return {
    title: 'Volunteer Activity over Months',
    headers: ['Activity', `Total ${unit}`, ...months],
    rows,
  };
};
