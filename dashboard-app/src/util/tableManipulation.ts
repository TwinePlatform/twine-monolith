import { Duration, MathUtil } from 'twine-util';
import { mergeAll } from 'ramda';
import { DataTableRow } from '../components/DataTable/types';
import { DurationUnitEnum } from '../types';

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


interface LogsToRows {(
  data: any,
  columnHeaders: string[],
  unit: DurationUnitEnum,
  rowIdFromLogs: string,
  getColumnIdFromLogs: (a: any) => string
  ): DataTableRow [];
}

export const logsToRows: LogsToRows = (data, cH, unit, rowIdFromLogs, getColumnIdFromLogs) => {
  const [firstColumn, ...columnRest] = cH;
  return data.reduce((acc: DataTableRow[], el: any) => {
    const activeColumn = getColumnIdFromLogs(el);
    const exists = acc.some((x: any) => x.columns[firstColumn].content === el[rowIdFromLogs]);
    if (exists) {
      return acc.map((x) => {
        if (x.columns[firstColumn].content === el[rowIdFromLogs]) {
          x.columns[activeColumn].content =
            addDurationToTableContents(x, activeColumn, unit, el.duration);
          x.columns[`Total ${unit}`].content =
            addDurationToTableContents(x, `Total ${unit}`, unit, el.duration);
        }
        return x;
      });
    }
    const activitiesContent = columnRest.map((a: string) => ({ [a]: { content: 0 } }));
    const newRow = {
      columns: {
        [firstColumn]: { content: el[rowIdFromLogs], },
        ...mergeAll(activitiesContent),
        [activeColumn]: { content: toUnitDuration(unit, el.duration) },
        [`Total ${unit}`]: { content: toUnitDuration(unit, el.duration) },
      },
    };
    return acc.concat(newRow);
  }, []);
};
