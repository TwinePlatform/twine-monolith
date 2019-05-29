import { AggregatedData } from './logsToAggregatedData';
import { toUnitDuration } from './util';
import { omit, map, Dictionary } from 'ramda';
import { DurationUnitEnum } from '../../types';
import { GraphColourList } from '../../styles/design_system';

export const STACKED_TABLE_OPTIONS = {
  legend: {
    position: 'right',
  },
  scales: {
    xAxes: [{
      stacked: true,
    }],
    yAxes: [{
      stacked: true,
    }],
  },
};

export const aggregatedToStackedGraph = (aggData: AggregatedData, unit: DurationUnitEnum) => {
  const [groupBy, ...labels] = aggData.headers;
  return {
    labels,
    datasets: aggData.rows.map((x, i) => {
      const label = x[groupBy];
      const withoutGroupBy = omit([groupBy], x);
      const dataObject = map((v) =>
        typeof v === 'object'
          ? toUnitDuration(unit, v)
          : v
        , withoutGroupBy) as Dictionary<any>;
      return {
        backgroundColor: GraphColourList[i],
        label,
        data: labels.map((y) => dataObject[y]),
      };
    }),
  };
};
