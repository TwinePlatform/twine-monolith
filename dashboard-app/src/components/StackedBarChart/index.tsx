import React, { FunctionComponent, useState } from 'react';
import { Grid, Row } from 'react-flexbox-grid';
import { ChartComponentProps } from 'react-chartjs-2';
import { evolve } from 'ramda';

import Legend from './Legend/index';
import { DurationUnitEnum } from '../../types';
import Chart from './Chart';
import { aggregatedToStackedGraph } from '../../dashboard/dataManipulation/aggregatedToGraphData';


/*
 * Types
 */

interface Props {
  data: ChartComponentProps['data'];
  unit: DurationUnitEnum;
  xAxisTitle: string;
  yAxisTitle: string;
  title: string;
}

interface ActiveDatum {
  key: string;
  active: boolean;
}

export type ActiveData = ActiveDatum[];

/*
 * Helpers
 */

const createActiveData = (data: AggregatedData): ActiveData => {
  return data.rows.map((row) => ({ key: row[data.groupByX] as string, active: true }));
};

const tareInactiveData = (data: AggregatedData, activeData: ActiveData) => evolve({
  rows: ((rows) => rows.map((row: any, i: number) => activeData[i].active
      ? row
      : Object.keys(row).slice(1).reduce((acc: object, el) => ({ ...acc, [el]: 0 }),
        { [data.groupByX]: row[data.groupByX] })
    )),
}, data);


/*
 * Components
 */

const StackedBarChart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title, unit } = props;
  const initialState = createActiveData(data);
  const [activeData, setActiveData] = useState(initialState);

  const taredData = tareInactiveData(data, activeData);
  const chartData = aggregatedToStackedGraph(taredData, unit);
  const chartProps = { data: chartData, xAxisTitle, yAxisTitle, title, unit };
  const legendProps = { activeData, setActiveData, title: data.groupByX };

  return (
    <Grid>
      <Row>
        <Chart {...chartProps}/>
        <Legend {...legendProps}/>
      </Row>
    </Grid>);
};

export default StackedBarChart;

