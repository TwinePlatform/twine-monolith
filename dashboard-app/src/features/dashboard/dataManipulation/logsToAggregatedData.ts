import { Dictionary } from 'ramda';
import { Duration, Objects } from 'twine-util';
import { collectBy } from 'twine-util/arrays';
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


const fetchIdAndName = (type: string, xData: Params['xData'], value: string | number): IdAndName => {
  switch (type) {
    case 'userId':
      const user = xData.find((x) => x.id === Number(value));
      return { id: user ? user.id : Number(value), name: user ? user.name : 'Deleted User' };

    case 'activity':
    default:
      const activity = xData.find((x) => x.name === value);
      return { id: activity ? activity.id : -1, name: activity ? activity.name : 'Unknown activity' };
  }
}

export const logsToAggregatedData = ({ logs, tableType, xData, yData }: Params): AggregatedData => { // tslint:disable:max-line-length
  const { groupByX, groupByY } = tableType;

  // Collect logs into buckets by X-data
  // Log[] -> { [X]: Log[] }
  const w = collectBy((log: any) => log[tableType.xIdFromLogs], logs);

  // Collect each bucket into sub-buckets by Y-data
  // { [X]: Log[] } -> { [X]: { [Y]: Log[] } }
  const x = Objects.mapValues((logs) => collectBy(tableType.getYIdFromLogs, logs), w);

  // Sum all log durations within buckets
  // { [X]: { [Y]: Log[] } } -> { [X]: { [Y]: Duration } }
  const y = Objects.mapValues((ys) => Objects.mapValues((_logs) => Duration.accumulate(_logs.map((l) => l.duration)), ys), x);

  // Interpolate Y-data (necessary when Y-data is month based)
  // { [X]: { [Y]: Duration } } -> { [X]: { [Y]: Duration } }
  const z = Objects.mapValues((ys) =>
    yData.reduce((acc, yDataPt) =>
      ys.hasOwnProperty(yDataPt.name)
        ? acc
        : { ...acc, [yDataPt.name]: Duration.fromSeconds(0) },
      ys),
    y);

  // Transform into row
  // { [X]: { [Y]: Duration } } -> ({ [Y]: Duration } & { name: [X], id: number })[]
  const rows = Object.entries(z).reduce((acc, [k, v]) => {
    const q = fetchIdAndName(tableType.xIdFromLogs, xData, k);
    return acc.concat({ ...v, ...q } as any);
  }, []);

  return {
    groupByX,
    groupByY,
    rows,
  };
};

