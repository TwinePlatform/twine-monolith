import React, { FunctionComponent, useState } from 'react';
import { Grid, Row } from 'react-flexbox-grid';
import { evolve, omit } from 'ramda';

import Legend from './Legend/index';
import { DurationUnitEnum } from '../../types';
import Chart from './Chart';
import { aggregatedToStackedGraph } from '../../dashboard/dataManipulation/aggregatedToGraphData';
import { AggregatedData } from '../../dashboard/dataManipulation/logsToAggregatedData';


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

interface ActiveDatum {
  key: string;
  active: boolean;
}

export type ActiveData = ActiveDatum[];

/*
 * Helpers
 */

export const createActiveData = (data: AggregatedData): ActiveData => data.rows
  .map((row) => ({ key: row[data.groupByX] as string, active: true }));

export const getYHeaderList = (row: Row, groupByX: string) => Object.keys(omit([groupByX], row));

export const zeroOutInactiveData = (data: AggregatedData, activeData: ActiveData) => evolve({
  rows: ((rows) => rows.map((row: any, i: number) => activeData[i].active
      ? row
      : getYHeaderList(row, data.groupByX).reduce((acc: object, el) => ({ ...acc, [el]: 0 }),
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

  const zeroedData = zeroOutInactiveData(data, activeData);
  const chartData = aggregatedToStackedGraph(zeroedData, unit);
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

