import React, { FunctionComponent, useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'react-flexbox-grid';

import {
  flipActiveOfAll,
  updateLegendData,
  sortAndZeroOutInactiveData,
  isEveryDatumInactive
} from './utils/util';
import { DurationUnitEnum } from '../../../../types';
import { aggregatedToStackedGraph } from '../../dataManipulation/aggregatedToGraphData'; //tslint:disable
import { AggregatedData } from '../../dataManipulation/logsToAggregatedData';
import Legend from './Legend/index';
import Chart from './Chart';
import { LegendData } from './types';
import { TitleString } from '../Title';


/*
 * Types
 */

interface Props {
  data: AggregatedData;
  unit: DurationUnitEnum;
  xAxisTitle: string;
  yAxisTitle: string;
  title: TitleString;
  legendData: LegendData;
  setLegendData: React.Dispatch<React.SetStateAction<LegendData>>;
}

/*
 * Components
 */

const StackedBarChart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title, unit, legendData, setLegendData } = props;
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
    setTooltipUnit(unit === DurationUnitEnum.DAYS ? 'days' : 'hrs');
  }, [unit]);

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

