import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';

const GenderChart = props => (
  <Doughnut
    data={props.data}
    options={{
      legend: {
        position: 'top',
      },
    }}
  />
);


GenderChart.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default GenderChart;
