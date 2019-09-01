import React, { FunctionComponent, useState, useEffect, useCallback, useContext } from 'react';
import { Row, Col } from 'react-flexbox-grid';

import {
  flipActiveOfAll,
  updateLegendData,
  sortAndZeroOutInactiveData,
  isEveryDatumInactive
} from './utils/util';
import { DurationUnitEnum } from '../../../../types';
import { aggregatedToStackedGraph } from '../../dataManipulation/aggregatedToGraphData';
import { AggregatedData } from '../../dataManipulation/logsToAggregatedData';
import Legend from './Legend/index';
import Chart from './Chart';
import { LegendData } from './types';
import { TitleString } from '../Title';
import { DashboardContext } from '../../../../App';


/*
 * Types
 */

interface Props {
  data: AggregatedData;
  xAxisTitle: string;
  yAxisTitle: string;
  title: TitleString;
  legendData: LegendData;
  setLegendData: React.Dispatch<React.SetStateAction<LegendData>>;
  defaultSelection: boolean;
}


/*
 * Helpers
 */

const getOverlayText = (data: AggregatedData, legendItemsActive: boolean): [boolean, string] => {
  const noActiveLegendText = data.groupByX === 'Activity'
    ? 'Select an activity to show data'
    : 'Select volunteers to show their hours';

  const dataExists = data.rows.length > 0;

  if (!dataExists) {
    return [true, 'No data for this range']
  } else if (!legendItemsActive) {
    return [true, noActiveLegendText];
  } else {
    return [false, ''];
  }
};


/*
 * Components
 */
const StackedBarChart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title, legendData, setLegendData, defaultSelection } = props;
  const { unit } = useContext(DashboardContext)
  const [chartData, setChartData] = useState();
  const [tooltipUnit, setTooltipUnit] = useState('');

  const setLegendActivityOnUpdate = (id: number) => () =>
    setLegendData((prevState: LegendData) =>
      prevState.map((x) =>
        x.id === id
          ? { ...x, active: !x.active }
          : x
      ));

  const setLegendActivityOfAll = useCallback(() => setLegendData(flipActiveOfAll), [setLegendData]);

  useEffect(() => {
    const newLegendData = updateLegendData(data, defaultSelection);
    const zeroedOutData = sortAndZeroOutInactiveData(data, newLegendData);
    setLegendData(newLegendData);
    setChartData(aggregatedToStackedGraph(zeroedOutData, unit));
  }, [data, setLegendData, setChartData, unit, defaultSelection]);

  useEffect(() => {
    const zeroedOutData = sortAndZeroOutInactiveData(data, legendData);
    setChartData(aggregatedToStackedGraph(zeroedOutData, unit));
  }, [data, legendData, unit]);

  useEffect(() => {
    setTooltipUnit(unit === DurationUnitEnum.DAYS ? 'days' : 'hrs');
  }, [unit]);

  const [isVisible, overlayText] = getOverlayText(data, !isEveryDatumInactive(legendData));

  const chartProps = {
    data: chartData,
    xAxisTitle,
    yAxisTitle,
    title,
    tooltipUnit,
    overlayText,
    isVisible,
  };

  const legendProps = {
    legendData,
    setLegendActivityOfAll,
    setLegendActivityOnUpdate,
    title: data.groupByX,
    defaultSelection
  };

  return (
    <Row center="xs">
      <Col xs={9}>
        <Chart {...chartProps} />
      </Col>
      <Col xs={3}>
        <Legend {...legendProps} />
      </Col>
    </Row>
  );
};

export default StackedBarChart;
