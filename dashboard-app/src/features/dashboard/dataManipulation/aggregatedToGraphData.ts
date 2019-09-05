import { omit } from 'ramda';
import { Objects } from 'twine-util';
import { AggregatedData } from './logsToAggregatedData';
import { toUnitDuration, abbreviateIfDateString } from './util';
import { DurationUnitEnum } from '../../../types';
import Months from '../../../lib/util/months';
import { getColourByIndex } from '../util';

export const aggregatedToStackedGraph = (data: AggregatedData, unit: DurationUnitEnum) => {
  const labels = Object.keys(omit(['id', 'name'], data.rows[0]));
  return {
    labels: labels.map((x) => abbreviateIfDateString(Months.format.abreviated, x).split(' ')),
    datasets: data.rows
      .map((row, i) => {
        const label = row.name as string;
        const rowData = omit(['id', 'name'], row);
        const numericData = Objects.mapValues((v) =>
          typeof v === 'object'
            ? toUnitDuration(unit, v)
            : Number(v)
          , rowData);
        return {
          backgroundColor: getColourByIndex(i),
          label,
          id: row.id,
          data: labels.map((y) => numericData[y]),
        };
      })
      // Reverse data-set order because Chart.js iterates
      // through list backwards, while Legend component
      // iterates through it forwards.
      // This ensures the legend and the stacks have the
      // same colour order.
      .reverse(),
  };
};
