import { Duration } from 'twine-util';
import { mergeAll, path, find, propEq, assocPath, Dictionary } from 'ramda';
import { TableTypeItem } from './tableType';


interface Params {
  logs: any;
  // columnHeaders: string[]; // replaced by yData?
  tableType: TableTypeItem;
  xData: { id: number, name: string }[]; // TODO: replace with Volunteer | User type
  yData: { id: number, name: string }[]; // TODO: replace with Volunteer | User type
}

export type Row = Dictionary<string | Duration.Duration>;
export interface AggregatedData {
  groupByX: string;
  groupByY: string;
  // headers: string [];
  rows: Row[];
}

// const mapVolunteerNamesIfExists = (vols: Params['xData'], rows: AggregatedData['rows']) =>
//   !vols
//     ? rows
//     : rows.map((row) => {
//       const id = path(['Volunteer Name'], row);
//       const activeVolunteer = find(propEq('id', id), vols);
//       return !activeVolunteer
//         ? assocPath(['Volunteer Name'], 'Deleted User', row)
//         : assocPath(['Volunteer Name'], activeVolunteer.name, row);
//     });

const getIdAndName = (xData: Params['xData'], tableType: TableTypeItem, log: Params['logs']) => {
  switch (tableType.xIdFromLogs){
    case('userId'):
      const user = xData.find((x) => x.id === log.userId);
      return { id: log.userId, name: user ? user.name : 'Deleted User' };

    case('activity'):
    default:
      const activity = xData.find((x) => x.name === log.activity);
      return { id: activity ? activity.id : NaN, name: log.activity };
  }
};

const checkIfRowExists = (row: Row, tableType: TableTypeItem, log: Params['logs']) => {
  switch (tableType.xIdFromLogs){
    case('userId'):
      return row.id === log.userId;

    case('activity'):
    default:
      return row.name === log.activity;
  }
};

const checkIfRowExistsInList = (acc: Row[], tableType: TableTypeItem, log: Params['logs']) => {
  switch (tableType.xIdFromLogs){
    case('userId'):
      return acc.some((row) => row.id === log.userId);

    case('activity'):
    default:
      return acc.some((row) => row.name === log.activity);
  }
};


export const logsToAggregatedData = ({ logs, tableType, xData, yData }: Params): AggregatedData => { // tslint:disable:max-line-length
  const { groupByX, groupByY } = tableType;
  // const [firstColumn, ...columnRest] = [groupByX, ...yData.map((x) => x.name)];
  const rows: Row[] = logs.reduce((rowsAcc: Dictionary<any>[], log: any) => {
    const activeColumn = tableType.getYIdFromLogs(log);

    const exists = checkIfRowExistsInList(rowsAcc, tableType, log);
    if (exists) {
      return rowsAcc.map((row) => {
        if (checkIfRowExists(row, tableType, log)) {
          row[activeColumn] = Duration.sum(row[activeColumn], log.duration);
        }
        return row;
      });
    }
    const emptyDurationElements = yData.map((a) => ({ [a.name]: Duration.fromSeconds(0) }));
    const idAndName = getIdAndName(xData, tableType, log);

    const newRow = {
      ...mergeAll(emptyDurationElements) as Dictionary<string>,
      [activeColumn]: log.duration,
      ...idAndName,
    };
    return rowsAcc.concat(newRow);
  }, []);

  return {
    groupByX,
    groupByY,
    // headers: [firstColumn, ...columnRest],
    rows,
  };
};

// Row groups
// Volunteer Name: [{id: 1, name: 'Me'}, {id: 2, name: 'You'}]
// Activity: [{id: 1, name: 'Jump'}, {id: 2, name: 'Cry'}]
// Month: [{id: 191, name: 'Jan 19'}, {id: 192, name: 'Feb 19'}]

// Column groups
