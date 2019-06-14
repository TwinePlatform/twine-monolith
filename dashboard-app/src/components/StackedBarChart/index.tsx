import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { Grid, Row } from 'react-flexbox-grid';
import styled from 'styled-components';

import {
  createLegendData,
  flipActiveOfAll,
  updateLegendData,
  sortAndZeroOutInactiveData
} from './utils/util';
import { DurationUnitEnum } from '../../types';
import { aggregatedToStackedGraph } from '../../dashboard/dataManipulation/aggregatedToGraphData';
import { AggregatedData } from '../../dashboard/dataManipulation/logsToAggregatedData';
import Legend from './Legend/index';
import Chart from './Chart';
import { LegendData } from './types';
import { ColoursEnum } from '../../styles/design_system';
import { Paragraph } from '../Typography';


/*
 * Types
 */

interface Props {
  data: AggregatedData;
  unit: DurationUnitEnum;
  xAxisTitle: string;
  yAxisTitle: string;
  title: string;
}

const NoDataContainer = styled.div`
  height: 10rem;
  color: ${ColoursEnum.white};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const noData = (
  <NoDataContainer>
    <Paragraph>NO DATA AVAILABLE</Paragraph>
  </NoDataContainer>
);

const checkIsDataEmpty = (cd: any) => {
  return (!cd || cd.datasets.length === 0);
};

/*
 * Components
 */

const StackedBarChart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title, unit } = props;
  const [legendData, setLegendData] = useState(createLegendData(data));
  const [chartData, setChartData] = useState();

  const setLegendActivityOnUpdate = (id: number) => () =>
    setLegendData((prevState: LegendData) =>
      prevState.map((x) =>
        x.id === id
          ? { ...x, active: !x.active }
          : x
      ));

  const setLegendActivityOfAll = useCallback(() => {
    setLegendData(flipActiveOfAll);
  }, [legendData]);

  useEffect(() => {
    const newLegendData = updateLegendData(data, legendData);
    const zeroedOutData = sortAndZeroOutInactiveData(data, newLegendData);
    setLegendData(newLegendData);
    setChartData(aggregatedToStackedGraph(zeroedOutData, unit));
  }, [data, unit]);

  useEffect(() => {
    const zeroedOutData = sortAndZeroOutInactiveData(data, legendData);
    setChartData(aggregatedToStackedGraph(zeroedOutData, unit));
  }, [legendData]);

  const chartProps = { data: chartData, xAxisTitle, yAxisTitle, title, unit };
  const legendProps = {
    legendData,
    setLegendActivityOfAll,
    setLegendActivityOnUpdate,
    title: data.groupByX,
  };

  const graph = (
    <>
      <Chart {...chartProps}/>
      <Legend {...legendProps}/>
    </>
  );

  return (
    <Grid>
      <Row center="xs">
        {
          !checkIsDataEmpty(chartData)
            ? graph
            : noData
        }
      </Row>
    </Grid>
  );
};

export default StackedBarChart;

