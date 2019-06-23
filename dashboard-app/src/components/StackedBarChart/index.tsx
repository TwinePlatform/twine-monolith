import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'react-flexbox-grid';

import {
  createLegendData,
  flipActiveOfAll,
  updateLegendData,
  sortAndZeroOutInactiveData,
  isEveryDatumInactive
} from './utils/util';
import { DurationUnitEnum } from '../../types';
import { aggregatedToStackedGraph } from '../../dashboard/dataManipulation/aggregatedToGraphData';
import { AggregatedData } from '../../dashboard/dataManipulation/logsToAggregatedData';
import Legend from './Legend/index';
import Chart from './Chart';
import { LegendData } from './types';


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

/*
 * Components
 */

const StackedBarChart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title, unit } = props;
  const [legendData, setLegendData] = useState(createLegendData(data));
  const [chartData, setChartData] = useState();
  const [tooltipUnit, setTooltipUnit] = useState('');

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

  useEffect(() => {
    const newValue = unit === DurationUnitEnum.DAYS
          ? 'days'
          : 'hrs';
    setTooltipUnit(newValue);
  });

  const noActiveLegendText = data.groupByX === 'Activity'
    ? 'Select an activity to show data'
    : 'Select a volunteer to show their hours';
  const isThereData = data.rows.length > 0;
  const chartProps = {
    data: chartData,
    xAxisTitle,
    yAxisTitle,
    title,
    tooltipUnit,
    noActiveLegendText,
    isAllLegendDataInactive: isEveryDatumInactive(legendData) && isThereData,
  };

  const legendProps = {
    legendData,
    setLegendActivityOfAll,
    setLegendActivityOnUpdate,
    title: data.groupByX,
  };

  return (
    <Row center="xs">
      <Col xs={9}>
        <Chart {...chartProps}/>
      </Col>
      <Col xs={3}>
        <Legend {...legendProps}/>
      </Col>
    </Row>
  );
};

export default StackedBarChart;

