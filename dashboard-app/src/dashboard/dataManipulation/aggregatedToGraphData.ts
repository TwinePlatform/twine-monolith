import { AggregatedData } from './logsToAggregatedData';
import { toUnitDuration, abbreviateIfDateString } from './util';
import { omit, map, Dictionary } from 'ramda';
import { DurationUnitEnum } from '../../types';
import { GraphColourList } from '../../styles/design_system';
import Months from '../../util/months';

export const aggregatedToStackedGraph = (data: AggregatedData, unit: DurationUnitEnum) => {
  console.log({ data });
  const labels = Object.keys(omit(['id', 'name'], data.rows[0]));
  return {
    labels: labels.map((x) => abbreviateIfDateString(Months.format.graph, x).split(' ')),
    datasets: data.rows.map((row, i) => {
      const label = row.name as string;
      const rowData = omit(['id', 'name'], row);
      const numericData = map((v) =>
        typeof v === 'object'
          ? toUnitDuration(unit, v)
          : v
        , rowData) as Dictionary<any>;
      return {
        backgroundColor: GraphColourList[i],
        label,
        key: row.id,
        data: labels.map((y) => numericData[y]),
      };
    }),
  };
};
