import React from 'react';
import styled from 'styled-components';

import { ChartType } from 'chart.js';
import ChartComponent, { ChartComponentProps } from 'react-chartjs-2';
import augmentChartJs from './RoundedBarChart';
import augmentChartJsTooltip from './tooltipCenter';


// MUTATES `Chart`
augmentChartJs();
augmentChartJsTooltip();

const Chart = styled(ChartComponent)`
  padding: 0.5em;
`;

class RoundedBar extends React.Component<ChartComponentProps> {
  render () {
    return (
      <Chart
        {...this.props}
        type={'roundedBar' as ChartType}
      />
    );
  }
}

export default RoundedBar;
