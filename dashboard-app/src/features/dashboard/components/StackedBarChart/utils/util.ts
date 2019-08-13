import { sortBy, pipe, prop, toLower, omit, evolve } from 'ramda';
import {
  AggregatedData,
  Row
} from '../../../dataManipulation/logsToAggregatedData';
import { LegendData, LegendDatum } from '../types';

export const sortByNameCaseInsensitive = sortBy(pipe(prop('name'), toLower));

export const createLegendData =
  (data: AggregatedData, defaultSelection: boolean) => {
    const visibleData = data.rows
      .map((row) => ({ id: row.id, name: row.name, active: defaultSelection } as LegendDatum));

    return sortByNameCaseInsensitive(visibleData);
  };

export const updateLegendData =
  (data: AggregatedData, oldActiveData: LegendData, defaultSelection: boolean) => {
    const visibleData = createLegendData(data, defaultSelection);

    const newLegendData = visibleData.map((newItem) =>
      oldActiveData.find((oldItem) => newItem.id === oldItem.id) || newItem
    );
    return sortByNameCaseInsensitive(newLegendData);
  };

export const getYHeaderList = (row: Row) => Object.keys(omit(['id', 'name'], row));

const zeroOutInactiveData = (legendData: LegendData) => (rows: Row[]) =>
  rows.
    map((row) => {
      const matchingLegendData = legendData.find((data) => data.id === row.id);
      if (!matchingLegendData) return row;
      return matchingLegendData.active
        ? row
        : getYHeaderList(row)
            .reduce((acc: object, el) => ({ ...acc, [el]: 0 }), { id: row.id, name: row.name });
    });

export const sortAndZeroOutInactiveData = (data: AggregatedData, legendData: LegendData) => evolve({
  rows: pipe(sortByNameCaseInsensitive, zeroOutInactiveData(legendData)),
}, data) as AggregatedData;


export const isEveryDatumActive = (data: LegendData) =>
  data.every((datum) => datum.active);

export const isEveryDatumInactive = (data: LegendData) =>
  data.every((datum) => !datum.active);

export const flipActiveOfAll = (data: LegendData) => {
  const active: boolean = isEveryDatumActive(data)
    ? false
    : isEveryDatumInactive(data);

  return data.map<LegendDatum>((x) => ({ ...x, active }));
};
