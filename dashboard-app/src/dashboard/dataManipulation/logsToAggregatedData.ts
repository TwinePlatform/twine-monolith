import { Duration } from 'twine-util';
import { mergeAll, path, find, propEq, assocPath, Dictionary } from 'ramda';
import { TableTypeItem } from './tableType';


interface Params {
  logs: any;
  columnHeaders: string[];
  tableType: TableTypeItem;
  volunteers?: { id: string, name: string }[]; // TODO: replace with Volunteer | User type
}

export type Row = Dictionary<string | Duration.Duration>;
export interface AggregatedData {
  groupByX: string;
  groupByY: string;
  headers: string [];
  rows: Row[];
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
  const rows: Dictionary<any>[] = logs.reduce((rowsAcc: Dictionary<any>[], log: any) => {
    const activeColumn = tableType.getYIdFromLogs(log);
    const exists = rowsAcc.some((row: any) => row[firstColumn] === log[tableType.xIdFromLogs]);
    if (exists) {
      return rowsAcc.map((row) => {
        if (row[firstColumn] === log[tableType.xIdFromLogs]) {
          row[activeColumn] = Duration.sum(row[activeColumn], log.duration);
        }
        return row;
      });
    }
    const columnElements = columnRest.map((a: string) => ({ [a]: Duration.fromSeconds(0) }));
    const newRow = {

      [firstColumn]: log[tableType.xIdFromLogs],
      ...mergeAll(columnElements) as Dictionary<string>,
      [activeColumn]: log.duration,

    };
    return rowsAcc.concat(newRow);
  }, []);

  const { groupByX, groupByY } = tableType;
  return {
    groupByX,
    groupByY,
    headers: [firstColumn, ...columnRest],
    rows: mapVolunteerNamesIfExists(volunteers, rows),
  };
};

