import { AggregatedData } from './logsToAggregatedData';
import { toUnitDuration } from './util';
import { omit, map, Dictionary } from 'ramda';
import { DurationUnitEnum } from '../../types';
import { GraphColourList } from '../../styles/design_system';

export const aggregatedToStackedGraph = (aggData: AggregatedData, unit: DurationUnitEnum) => {
  const [groupBy, ...labels] = aggData.headers;
  return {
    labels,
    datasets: aggData.rows.map((row, i) => {
      const label = row[groupBy];
      const rowData = omit([groupBy], row);
      const numericData = map((v) =>
        typeof v === 'object'
          ? toUnitDuration(unit, v)
          : v
        , rowData) as Dictionary<any>;
      return {
        backgroundColor: GraphColourList[i],
        label,
        data: labels.map((y) => numericData[y]),
      };
    }),
  };
};
