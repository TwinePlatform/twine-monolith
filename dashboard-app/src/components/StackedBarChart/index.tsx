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
  legendData: IdAndName[];
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

export const createActiveLegendData =
  (data: AggregatedData, legendData: IdAndName[]): LegendData => {
    const allValues = legendData.map((x) => ({ ...x, active: true }));
    const visibleValues = data.rows
    .map((row) => ({ id: row.id }));

    return allValues.filter((x) => visibleValues.find((y) => y.id === x.id));
  };

export const getYHeaderList = (row: AggDataRow) => Object.keys(omit(['id', 'name'], row));

export const zeroOutInactiveData = (data: AggregatedData, legendData: LegendData) => evolve({
  rows: ((rows: AggDataRow[]) => rows.map((row, i: number) => {
    return legendData[i].active
      ? row
      : getYHeaderList(row).reduce((acc: object, el) => ({ ...acc, [el]: 0 }), {});
  }
    )),
}, data);


/*
 * Components
 */
// tslint:disable:max-line-length
const StackedBarChart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title, unit, legendData } = props;
  const [activeLegendData, setActiveLegendData] = useState(createActiveLegendData(data, legendData));
  const [chartData, setChartData] = useState();

  useEffect(() => {
    const newData = createActiveLegendData(data, legendData); // TD: data, oldActiveData -> newActiveData
    const zeroedOutData = zeroOutInactiveData(data, newData);
    setActiveLegendData(newData);
    setChartData(aggregatedToStackedGraph(zeroedOutData, unit));
  }, [data, unit]);

  useEffect(() => {
    const zeroedOutData = zeroOutInactiveData(data, activeLegendData);
    setChartData(aggregatedToStackedGraph(zeroedOutData, unit));
  }, [activeLegendData]);

  const chartProps = { data: chartData, xAxisTitle, yAxisTitle, title, unit };
  const legendProps = { activeLegendData, setActiveLegendData, title: data.groupByX };

  return (
    <Grid>
      <Row>
        <Chart {...chartProps}/>
        <Legend {...legendProps}/>
      </Row>
    </Grid>);
};

export default StackedBarChart;

