import React, { FunctionComponent, useState, useEffect } from 'react';
import { Grid, Row } from 'react-flexbox-grid';
import { evolve, omit } from 'ramda';

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

export const createLegendData =
  (data: AggregatedData, legendOption: IdAndName[]): LegendData => {
    const allPossibleLegendData = legendOption.map((x) => ({ ...x, active: true }));
    const visibleValues = data.rows
      .map((row) => ({ id: row.id }));

    return allPossibleLegendData
    .filter((possibleItem) => visibleValues
      .find((visibleItem) => visibleItem.id === possibleItem.id));
  };

export const updateLegendData =
  (data: AggregatedData, legendOption: IdAndName[], oldActiveData: LegendData): LegendData => {
    const allPossibleLegendData = legendOption.map((x) => ({ ...x, active: true }));
    const visibleValues = data.rows
      .map((row) => ({ id: row.id }));

    const newLegendData = allPossibleLegendData
      .filter((possibleItem) => visibleValues
        .find((visibleValue) => visibleValue.id === possibleItem.id));

    return newLegendData.map((newItem) =>
      oldActiveData.find((oldItem) => newItem.id === oldItem.id) || newItem
    );
  };

export const getYHeaderList = (row: AggDataRow) => Object.keys(omit(['id', 'name'], row));

export const zeroOutInactiveData = (data: AggregatedData, legendData: LegendData) => evolve({
  rows: ((rows: AggDataRow[]) => rows.map((row, i: number) => {
    return legendData[i].active
      ? row
      : getYHeaderList(row).reduce((acc: object, el) => ({ ...acc, [el]: 0 }),
        { id: row.id, name: row.name });
  }
    )),
}, data) as AggregatedData;


/*
 * Components
 */
// tslint:disable:max-line-length
const StackedBarChart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title, unit, legendOptions } = props;
  const [legendData, setLegendData] = useState(createLegendData(data, legendOptions));
  const [chartData, setChartData] = useState();

  useEffect(() => {
    const newData = updateLegendData(data, legendOptions, legendData);
    const zeroedOutData = zeroOutInactiveData(data, newData);
    setLegendData(newData);
    setChartData(aggregatedToStackedGraph(zeroedOutData, unit));
  }, [data, unit]);

  useEffect(() => {
    const zeroedOutData = zeroOutInactiveData(data, legendData);
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

