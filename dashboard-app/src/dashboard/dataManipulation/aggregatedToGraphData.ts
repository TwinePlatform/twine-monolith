import { Objects } from 'twine-util';
import { AggregatedData } from './logsToAggregatedData';
import { toUnitDuration, abbreviateIfDateString } from './util';
import { omit } from 'ramda';
import { DurationUnitEnum } from '../../types';
import { GraphColourList } from '../../styles/design_system';
import Months from '../../util/months';

export const aggregatedToStackedGraph = (data: AggregatedData, unit: DurationUnitEnum) => {
  const labels = Object.keys(omit(['id', 'name'], data.rows[0]));
  return {
    labels: labels.map((x) => abbreviateIfDateString(Months.format.abreviated, x).split(' ')),
    datasets: data.rows.map((row, i) => {
      const label = row.name as string;
      const rowData = omit(['id', 'name'], row);
      const numericData = Objects.mapValues((v) =>
        typeof v === 'object'
          ? toUnitDuration(unit, v)
          : Number(v)
        , rowData);
      return {
        backgroundColor: GraphColourList[i],
        label,
        id: row.id,
        data: labels.map((y) => numericData[y]),
      };
    }),
  };
};
