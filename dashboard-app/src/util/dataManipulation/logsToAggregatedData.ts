import { Duration } from 'twine-util';
import { mergeAll, path, find, propEq, assocPath, Dictionary } from 'ramda';
import { TableTypeItem } from './tableType';


interface Params {
  logs: any;
  columnHeaders: string[];
  tableType: TableTypeItem;
  volunteers?: { id: string, name: string }[];
}

export interface AggregatedData {
  headers: string [];
  rows: Dictionary<string | Duration.Duration>[];
}

const mapVolunteerNamesIfExists = (vols: Params['volunteers'], rows: AggregatedData['rows']) =>
  !vols
    ? rows
    : rows.map((row) => {
      const id = path(['Volunteer Name'], row);
      const activeVolunteer = find(propEq('id', id), vols);
      return !activeVolunteer
        ? assocPath(['Volunteer Name'], 'Deleted User', row)
        : assocPath(['Volunteer Name'], activeVolunteer.name, row);
    });


export const logsToAggregatedData = ({ logs, columnHeaders, tableType, volunteers }: Params): AggregatedData => { // tslint:disable:max-line-length
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
    const columnElements = columnRest.map((a: string) => ({ [a]: Duration.fromSeconds(0) }));
    const newRow = {

      [firstColumn]: el[tableType.rowIdFromLogs],
      ...mergeAll(columnElements),
      [activeColumn]: el.duration,

    };
    return logsRows.concat(newRow);
  }, []);

  return {
    headers: [firstColumn, ...columnRest],
    rows: mapVolunteerNamesIfExists(volunteers, rows),
  };
};
