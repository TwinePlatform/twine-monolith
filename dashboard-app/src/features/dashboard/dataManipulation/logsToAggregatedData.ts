import { Duration } from 'twine-util';
import { mergeAll, Dictionary } from 'ramda';
import { TableTypeItem } from './tableType';


export interface IdAndName {
  id: number;
  name: string;
}

interface Params {
  logs: any;
  tableType: TableTypeItem;
  xData: IdAndName[];
  yData: IdAndName[];
}

export type Row = Dictionary<string | Duration.Duration>;
export interface AggregatedData {
  groupByX: string;
  groupByY: string;
  rows: Row[];
}

export const isDataEmpty = (d: AggregatedData) => d.rows.length === 0;

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


export const logsToAggregatedData = ({ logs, tableType, xData, yData }: Params): AggregatedData => {
  const { groupByX, groupByY } = tableType;
  const rows: Row[] = logs.reduce((rowsAcc: Dictionary<any>[], log: any) => {
    const activeColumn = tableType.getYIdFromLogs(log);

    const exists = checkIfRowExistsInList(rowsAcc, tableType, log);
    if (exists) {
      return rowsAcc.map((row) => {
        if (checkIfRowExists(row, tableType, log)) {
          row[activeColumn] = Duration.sum(row[activeColumn] || {}, log.duration);
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
    rows,
  };
};

