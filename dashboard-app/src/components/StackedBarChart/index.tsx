import React, { FunctionComponent, useState, useEffect } from 'react';
import { Grid, Row } from 'react-flexbox-grid';
import { evolve, omit, sortBy, pipe, toLower, prop } from 'ramda';

import { DurationUnitEnum } from '../../types';
import { aggregatedToStackedGraph } from '../../dashboard/dataManipulation/aggregatedToGraphData';
import {
  AggregatedData,
  IdAndName,
  Row as AggDataRow
} from '../../dashboard/dataManipulation/logsToAggregatedData';

import Legend from './Legend/index';
import Chart from './Chart';


/*
 * Types
 */

interface Props {
  data: AggregatedData;
  legendOptions: IdAndName[];
  unit: DurationUnitEnum;
  xAxisTitle: string;
  yAxisTitle: string;
  title: string;
}

interface LegendDatum {
  id: number;
  name: string;
  active: boolean;
}

export type LegendData = LegendDatum[];

/*
 * Helpers
 */

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

export const getYHeaderList = (row: AggDataRow) => Object.keys(omit(['id', 'name'], row));

const zeroOutInactiveData = (legendData: LegendData) => (rows: AggDataRow[]) =>
  rows.
    map((row, i: number) => {
      return legendData[i].active
    ? row
    : getYHeaderList(row).reduce((acc: object, el) => ({ ...acc, [el]: 0 }),
      { id: row.id, name: row.name });
    });

export const sortAndZeroOutInactiveData = (data: AggregatedData, legendData: LegendData) => evolve({
  rows: pipe(sortByNameCaseInsensitive, zeroOutInactiveData(legendData)),
}, data) as AggregatedData;

/*
 * Components
 */

const StackedBarChart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title, unit, legendOptions } = props;
  const [legendData, setLegendData] = useState(createLegendData(data, legendOptions));
  const [chartData, setChartData] = useState();

  useEffect(() => {
    const newLegendData = updateLegendData(data, legendOptions, legendData);
    const zeroedOutData = sortAndZeroOutInactiveData(data, newLegendData);
    setLegendData(newLegendData);
    setChartData(aggregatedToStackedGraph(zeroedOutData, unit));
  }, [data, unit]);

  useEffect(() => {
    const zeroedOutData = sortAndZeroOutInactiveData(data, legendData);
    setChartData(aggregatedToStackedGraph(zeroedOutData, unit));
  }, [legendData]);

  const chartProps = { data: chartData, xAxisTitle, yAxisTitle, title, unit };
  const legendProps = { legendData, setLegendData, title: data.groupByX };

  return (
    <Grid>
      <Row>
        <Chart {...chartProps}/>
        <Legend {...legendProps}/>
      </Row>
    </Grid>);
};

export default StackedBarChart;

