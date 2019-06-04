import React, { FunctionComponent, useState } from 'react';
import { Grid, Row } from 'react-flexbox-grid';
import { ChartComponentProps } from 'react-chartjs-2';
import { evolve } from 'ramda';

import Legend from './Legend/index';
import { DurationUnitEnum } from '../../types';
import Chart from './Chart';


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

interface StateItem {
  key: string;
  active: boolean;
}

type State = StateItem[];

/*
 * Components
 */

const StackedBarChart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title, unit } = props;
  const initialState = data.rows.map((x) => ({ key: x[data.headers[0]] as string, active: true })); {/*TD*/}
  const [activeData, setActiveData] = useState<State>(initialState);

  const setActiveDataPoint = (t: string) => {
    setActiveData((prevState: State) => prevState.map((x) =>
      x.key === t
        ? {
          key: t,
          active: !x.active,
        }
      : x
     ));
  };

  const chartData = evolve({
    rows: ((row) => row.map((x: any, i: number) => activeData[i].active
      ? x
      : Object.keys(x).reduce((acc: object, el) => ({ ...acc, [el]: 0 }), {})
    )),
  }, data);

  console.log({ data, activeData });
  const chartProps = { data: chartData, xAxisTitle, yAxisTitle, title, unit };
  const legendProps = { activeData, setActiveDataPoint };
  return (
    <Grid>
      <Row>
        <Chart {...chartProps}/>
        <Legend {...legendProps}/>
      </Row>
    </Grid>);
};

export default StackedBarChart;

