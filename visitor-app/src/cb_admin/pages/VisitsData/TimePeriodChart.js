import React from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';


const TimePeriodChart = (props) => {
  return (
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
  );
};

TimePeriodChart.propTypes = {
  data: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({ stepSize: PropTypes.number }),
};

TimePeriodChart.defaultProps = {
  options: { stepSize: 2 },
};

export default TimePeriodChart;
