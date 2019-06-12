import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { Grid, Row } from 'react-flexbox-grid';

import {
  createLegendData,
  flipActiveOfAll,
  updateLegendData,
  sortAndZeroOutInactiveData
} from './utils/util';
import { DurationUnitEnum } from '../../types';
import { aggregatedToStackedGraph } from '../../dashboard/dataManipulation/aggregatedToGraphData';
import {
  AggregatedData,
  IdAndName,
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
 * Components
 */

const StackedBarChart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title, unit, legendOptions } = props;
  const [legendData, setLegendData] = useState(createLegendData(data, legendOptions));
  const [chartData, setChartData] = useState();

  const setLegendActivityOnUpdate = (id: number) => {
    return () => setLegendData((prevState: LegendData): LegendData =>
      prevState.map((x) =>
        x.id === id
          ? {
            ...x,
            active: !x.active,
          }
        : x
      ));
  };

  const setLegendActivityOfAll = useCallback(() => {
    setLegendData(flipActiveOfAll);
  }, [legendData]);


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
  const legendProps = { legendData, setLegendActivityOfAll, setLegendActivityOnUpdate, title: data.groupByX }; // tslint:disable-line:max-line-length

  return (
    <Grid>
      <Row>
        <Chart {...chartProps}/>
        <Legend {...legendProps}/>
      </Row>
    </Grid>);
};

export default StackedBarChart;

