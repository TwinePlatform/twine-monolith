

import { sortBy, pipe, prop, toLower, omit, evolve } from 'ramda';
import {
  AggregatedData,
  IdAndName,
  Row
} from '../../../dashboard/dataManipulation/logsToAggregatedData';
import { LegendData } from '../types';

export const sortByNameCaseInsensitive = sortBy(pipe(prop('name'), toLower));

export const createLegendData =
  (data: AggregatedData, legendOption: IdAndName[]): LegendData => {
    const allPossibleLegendData = legendOption
      .map((x) => ({ ...x, active: true }));
    const visibleValues = data.rows
      .map((row) => ({ id: row.id }));

    const newLegendData = allPossibleLegendData
      .filter((possibleItem) => visibleValues
        .find((visibleItem) => visibleItem.id === possibleItem.id));

    return sortByNameCaseInsensitive(newLegendData);
  };

export const updateLegendData =
  (data: AggregatedData, legendOption: IdAndName[], oldActiveData: LegendData): LegendData => {
    const allPossibleLegendData = legendOption.map((x) => ({ ...x, active: true }));
    const visibleValues = data.rows
      .map((row) => ({ id: row.id }));

    const newLegendDataWithoutUpdatedActive = allPossibleLegendData
      .filter((possibleItem) => visibleValues
        .find((visibleValue) => visibleValue.id === possibleItem.id));

    const newLegendData = newLegendDataWithoutUpdatedActive.map((newItem) =>
      oldActiveData.find((oldItem) => newItem.id === oldItem.id) || newItem
    );
    return sortByNameCaseInsensitive(newLegendData);
  };

export const getYHeaderList = (row: Row) => Object.keys(omit(['id', 'name'], row));

const zeroOutInactiveData = (legendData: LegendData) => (rows: Row[]) =>
  rows.
    map((row, i: number) => {
      if (! legendData[i]) return row;
      return legendData[i].active
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
