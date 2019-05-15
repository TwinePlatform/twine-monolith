import { Duration, MathUtil } from 'twine-util';
import { mergeAll, path, find, propEq, assocPath } from 'ramda';
import { DurationUnitEnum } from '../../types';
import { TableTypeItem } from './tableType';


const roundToDecimal = MathUtil.roundTo(2);

const toUnitDuration = (unit: DurationUnitEnum, duration: Duration.Duration) => {
  switch (unit){
    case DurationUnitEnum.DAYS:
      return roundToDecimal(Duration.toWorkingDays(duration));

    case DurationUnitEnum.HOURS:
      return roundToDecimal(Duration.toHours(duration));
  }
};

const addDurationsToDataAggs = (
  row: any,
  columnKey: string,
  unit: DurationUnitEnum,
  duration: Duration.Duration) => {
  return roundToDecimal(Number(row[columnKey]) + toUnitDuration(unit, duration));
};


const mapUserNames = (logs: any[], volunteers: any[]) => logs.map((row) => {
  const id = path(['Volunteer Name'], row);
  const activeVolunteer = find(propEq('id', id), volunteers);
  if (!activeVolunteer) {
    return assocPath(['Volunteer Name'], 'Deleted', row);
  }
  return assocPath(['Volunteer Name'], activeVolunteer.name, row);
});


interface Params {
  logs: any;
  columnHeaders: string[];
  unit: DurationUnitEnum;
  tableType: TableTypeItem;
  volunteers?: any;
}

export const logsToAggregatedData = ({ logs, columnHeaders, unit, tableType, volunteers }: Params) => { // tslint:disable:max-line-length
  const [firstColumn, ...columnRest] = columnHeaders;
  const rows = logs.reduce((logsRows: any[], el: any) => {
    const activeColumn = tableType.getColumnIdFromLogs(el);
    const exists = logsRows.some((logs: any) =>
      logs[firstColumn] === el[tableType.rowIdFromLogs]);
    if (exists) {
      return logsRows.map((logs) => {
        if (logs[firstColumn] === el[tableType.rowIdFromLogs]) {
          logs[activeColumn] =
            addDurationsToDataAggs(logs, activeColumn, unit, el.duration);
          logs[`Total ${unit}`] =
            addDurationsToDataAggs(logs, `Total ${unit}`, unit, el.duration);
        }
        return logs;
      });
    }
    const columnElements = columnRest.map((a: string) => ({ [a]: 0 }));
    const newRow = {

      [firstColumn]: el[tableType.rowIdFromLogs],
      ...mergeAll(columnElements),
      [activeColumn]: toUnitDuration(unit, el.duration),
      [`Total ${unit}`]: toUnitDuration(unit, el.duration),

    };
    return logsRows.concat(newRow);
  }, []);


  return {
    headers: [firstColumn, `Total ${unit}`, ...columnRest],
    rows: volunteers ? mapUserNames(rows, volunteers) : rows,
  };
};
