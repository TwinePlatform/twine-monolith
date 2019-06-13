import React from 'react';
import { ChartType } from 'chart.js';
import ChartComponent, { ChartComponentProps } from 'react-chartjs-2';
import augmentChartJs from './RoundedBarChart';


// MUTATES `Chart`
augmentChartJs();


class RoundedBar extends React.Component<ChartComponentProps> {
  render () {
    return (
      <ChartComponent
        {...this.props}
        type={'roundedBar' as ChartType}
      />
    );
  }
}

export default RoundedBar;
