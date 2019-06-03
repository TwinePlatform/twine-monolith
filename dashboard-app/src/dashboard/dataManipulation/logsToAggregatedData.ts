import { Duration } from 'twine-util';
import { mergeAll, path, find, propEq, assocPath, Dictionary } from 'ramda';
import { TableTypeItem } from './tableType';


interface Params {
  logs: any;
  columnHeaders: string[];
  tableType: TableTypeItem;
  volunteers?: { id: string, name: string }[]; // TODO: replace with Volunteer | User type
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
      return logsRows.map((row) => {
        if (row[firstColumn] === el[tableType.rowIdFromLogs]) {
          row[activeColumn] = Duration.sum(row[activeColumn], el.duration);
        }
        return row;
      });
    }
    const columnElements = columnRest.map((a: string) => ({ [a]: Duration.fromSeconds(0) }));
    const newRow = {

      [firstColumn]: el[tableType.rowIdFromLogs],
      ...mergeAll(columnElements) as Dictionary<string>,
      [activeColumn]: el.duration,

    };
    return logsRows.concat(newRow);
  }, []);

  return {
    headers: [firstColumn, ...columnRest],
    rows: mapVolunteerNamesIfExists(volunteers, rows),
  };
};

// has rows/cells | headers
// project object onto existing matrix

// project(rowId, colId, (a, b) => T, logs, emptyMatrix)

// augment headers and cols
