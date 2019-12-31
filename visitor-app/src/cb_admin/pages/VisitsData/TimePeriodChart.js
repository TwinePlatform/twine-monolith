import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import Overlay from './Overlay';
import { isChartJsDataEmpty } from './util';


const TimePeriodChart = props => (
  <Overlay content="No data available" isVisible={isChartJsDataEmpty(props.data)}>
    <Bar
      data={props.data}
      options={{
        legend: { display: false },
        scales: {
          xAxes: [{
            gridLines: { display: false },
            ticks: { padding: 5 },
          }],
          yAxes: [{
            gridLines: { display: false },
            ticks: {
              display: true,
              beginAtZero: true,
              stepSize: props.options.stepSize,
            },
          }],
        },
      }}
    />
  </Overlay >
);


TimePeriodChart.propTypes = {
  data: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({ stepSize: PropTypes.number }),
};

TimePeriodChart.defaultProps = {
  options: { stepSize: 2 },
};

export default TimePeriodChart;
