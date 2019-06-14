

import { sortBy, pipe, prop, toLower, omit, evolve } from 'ramda';
import { AggregatedData, Row } from '../../../dashboard/dataManipulation/logsToAggregatedData';
import { LegendData, LegendDatum } from '../types';

export const sortByNameCaseInsensitive = sortBy(pipe(prop('name'), toLower));

export const createLegendData =
  (data: AggregatedData): LegendData => {
    const visibleData = data.rows
      .map((row) => ({ id: row.id, name: row.name, active: true } as LegendDatum));

    return sortByNameCaseInsensitive(visibleData);
  };

export const updateLegendData =
  (data: AggregatedData, oldActiveData: LegendData): LegendData => {
    const visibleData = createLegendData(data);

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
    : getYHeaderList(row).reduce((acc: object, el) => ({ ...acc, [el]: 0 }),
      { id: row.id, name: row.name });
    });

export const sortAndZeroOutInactiveData = (data: AggregatedData, legendData: LegendData) => evolve({
  rows: pipe(sortByNameCaseInsensitive, zeroOutInactiveData(legendData)),
}, data) as AggregatedData;


export const isEveryDatumActive = (data: LegendData): boolean =>
  data.every((datum) => datum.active);

export const isEveryDatumInactive = (data: LegendData): boolean =>
  data.every((datum) => !datum.active);

export const flipActiveOfAll = (data: LegendData): LegendData => {
  const active: boolean = isEveryDatumActive(data)
    ? false
    : isEveryDatumInactive(data);

  return data.map((x) => ({ ...x, active }));
};
