import { Duration, MathUtil } from 'twine-util';
import { pipe, mergeAll, path, find, propEq, assocPath, Dictionary, map, curry } from 'ramda';
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

const mapVolunteerNamesIfExists = curry((volunteers: any[] | null, rows: Dictionary<any>[]) =>
  rows.map((row) => {
    if (!volunteers) {
      return row;
    }
    const id = path(['Volunteer Name'], row);
    const activeVolunteer = find(propEq('id', id), volunteers);
    if (!activeVolunteer) {
      return assocPath(['Volunteer Name'], 'Deleted User', row);
    }
    return assocPath(['Volunteer Name'], activeVolunteer.name, row);
  })) as any;

const mapDurationToUnitDuration = curry((unit: DurationUnitEnum, rows: any[]) =>
  map(map((cell) => {
    return typeof cell === 'object'
      ? toUnitDuration(unit, cell)
      : cell;
  }), rows));


interface Params {
  logs: any;
  columnHeaders: string[];
  tableType: TableTypeItem;
  volunteers?: any;
}

export interface AggregatedData {
  headers: string [];
  rows: Dictionary<number | string>[];
}

export const logsToAggregatedData = ({ logs, columnHeaders, tableType, volunteers = null }: Params): AggregatedData => { // tslint:disable:max-line-length
  const [firstColumn, ...columnRest] = columnHeaders;
  const rows: Dictionary<any>[] = logs.reduce((logsRows: Dictionary<any>[], el: any) => {
    const activeColumn = tableType.getColumnIdFromLogs(el);
    const exists = logsRows.some((logs: any) =>
      logs[firstColumn] === el[tableType.rowIdFromLogs]);
    if (exists) {
      return logsRows.map((logs) => {
        if (logs[firstColumn] === el[tableType.rowIdFromLogs]) {
          logs[activeColumn] = Duration.sum(logs[activeColumn], el.duration);
        }
        return logs;
      });
    }
    const columnElements = columnRest.map((a: string) => ({ [a]: 0 }));
    const newRow = {

      [firstColumn]: el[tableType.rowIdFromLogs],
      ...mergeAll(columnElements),
      [activeColumn]: el.duration,

    };
    return logsRows.concat(newRow);
  }, []);

  const pipeRows: (x: Dictionary<any>[]) => Dictionary<string | number>[] = pipe(
    mapVolunteerNamesIfExists(volunteers)
  );

  return {
    headers: [firstColumn, ...columnRest],
    rows: pipeRows(rows),
  };
};
