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
      return { id: user ? user.id : -1, name: user ? user.name : 'Deleted User' };

    case 'activity':
    default:
      const activity = xData.find((x) => x.name === value);
      return { id: activity ? activity.id : -1, name: activity ? activity.name : 'Unknown activity' };
  }
}

export const logsToAggregatedData = ({ logs, tableType, xData, yData }: Params): AggregatedData => { // tslint:disable:max-line-length
  const { groupByX, groupByY } = tableType;

  // Log[] -> { [X]: Log[] }
  const w = collectBy((log: any) => log[tableType.xIdFromLogs], logs);

  // { [X]: Log[] } -> { [X]: { [Y]: Log[] } }
  const x = Objects.mapValues((logs) => collectBy(tableType.getYIdFromLogs, logs), w);

  // { [X]: { [Y]: Log[] } } -> { [X]: { [Y]: Number } }
  const y = Objects.mapValues((ys) => Objects.mapValues((_logs) => Duration.accumulate(_logs.map((l) => l.duration)), ys), x);

  // Interpolate months
  // { [X]: { [Y]: Number } } -> { [X]: { [Y]: Number } }
  const z = Objects.mapValues((ys) =>
    yData.reduce((acc, yDataPt) =>
      ys.hasOwnProperty(yDataPt.name)
        ? acc
        : { ...acc, [yDataPt.name]: Duration.fromSeconds(0) },
      ys),
    y)

  // { [X]: { [Y]: Number } } -> ({ [Y]: Number } & { name: [X], id: number })[]
  const a = Object.entries(z).reduce((acc, [k, v]) => {
    const q = fetchIdAndName(tableType.xIdFromLogs, xData, k);
    return acc.concat({ ...v, ...q } as any);
  }, []);

  return {
    groupByX,
    groupByY,
    rows: a,
  };
};

