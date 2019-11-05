import { Duration } from 'twine-util';
import { collectBy } from 'twine-util/arrays';
import { mapValues } from 'twine-util/objects';
import { Dictionary } from 'ramda';
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

const getIdAndName = (type: string, xData: Params['xData'], value: string | number) => {
  switch (type) {
    case 'userId':
      const user = xData.find((x) => x.id === Number(value));
      return { id: user ? user.id : Number(value), name: user ? user.name : 'Deleted User' };

    case 'project':
      const project = xData.find((x) => x.name === value);
      return { id: project ? project.id : -1, name: project ? project.name : 'General' };

    case 'activity':
    default:
      const activity = xData.find((x) => x.name === value);
      return { id: activity ? activity.id : -1, name: activity ? activity.name : 'Unknown Activity' };
  }
};

export const logsToAggregatedData = ({ logs, tableType, xData, yData }: Params): AggregatedData => {
  const { groupByX, groupByY } = tableType;

  // Collect logs into buckets by X-data
  // Log[] -> { [X]: Log[] }
  const w = collectBy((log: any) => log[tableType.xIdFromLogs], logs);

  // Collect each bucket into sub-buckets by Y-data
  // { [X]: Log[] } -> { [X]: { [Y]: Log[] } }
  const x = mapValues((logs) => collectBy(tableType.getYIdFromLogs, logs), w);

  // Sum all log durations within buckets
  // { [X]: { [Y]: Log[] } } -> { [X]: { [Y]: Duration } }
  const y = mapValues((ys) => mapValues((_logs) => Duration.accumulate(_logs.map((l) => l.duration)), ys), x);

  // Interpolate Y-data (necessary when Y-data is month based)
  // { [X]: { [Y]: Duration } } -> { [X]: { [Y]: Duration } }
  const z = mapValues((ys) =>
    yData.reduce((acc, yDataPt) =>
      ys.hasOwnProperty(yDataPt.name)
        ? acc
        : { ...acc, [yDataPt.name]: Duration.fromSeconds(0) },
      ys),
    y);

  // Transform into row
  // { [X]: { [Y]: Duration } } -> ({ [Y]: Duration } & { name: [X], id: number })[]
  const rows = Object.entries(z)
    .reduce((acc, [X, Ys]) =>
      acc.concat(Object.assign({}, Ys, getIdAndName(tableType.xIdFromLogs, xData, X))), [] as Row[]);

  return {
    groupByX,
    groupByY,
    rows,
  };
};

