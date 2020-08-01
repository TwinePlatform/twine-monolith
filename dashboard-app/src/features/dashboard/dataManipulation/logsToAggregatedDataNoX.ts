import { Duration } from 'twine-util';
import { collectBy, interpolateObjFrom } from 'twine-util/arrays';
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
  groupByX: TableTypeItem['groupByX'];
  groupByY: TableTypeItem['groupByY'];
  rows: Row[];
}

export const isDataEmpty = (d: AggregatedData) => d.rows.length === 0;

const getIdAndName = (type: TableTypeItem['xIdFromLogs'], xData: Params['xData'], value: string | number) => {
  switch (type) {
    case 'userId':
      const user = xData.find((x) => x.id === Number(value));
      return user
        ? { id: user.id, name: user.name }
        : { id: Number(value), name: 'Deleted User' };

    case 'project':
      const project = xData.find((x) => x.name === value);
      return project
        ? { id: project.id, name: project.name }
        : { id: -1, name: 'General' };

    case 'activity':
    default:
      const activity = xData.find((x) => x.name === value);
      return activity
        ? { id: activity.id, name: activity.name }
        : { id: -1, name: 'Unknown Activity' };
  }
};

export const logsToAggregatedDataNoX = ({ logs, tableType, xData, yData }: Params): AggregatedData => {
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

  // Interpolate null values in both dimensions (X-data and Y-data)
  // (necessary when values exist in X- and Y-data that aren't present in the logs)
  // { [X]: { [Y]: Duration } } -> { [X]: { [Y]: Duration } }
  const z = mapValues((ys) => interpolateObjFrom(yData.map((y) => y.name), Duration.fromSeconds(0), ys), y);

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

