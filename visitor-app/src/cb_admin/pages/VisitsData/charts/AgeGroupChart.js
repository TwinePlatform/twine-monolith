import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import Overlay from '../Overlay';
import { isChartJsDataEmpty } from '../util';


const AgeGroupChart = props => (
  <Overlay content="No data available" isVisible={isChartJsDataEmpty(props.data)}>
    <Doughnut
      data={props.data}
      options={{
        legend: {
          position: 'top',
        },
      }}
    />
  </Overlay>
);


AgeGroupChart.propTypes = {
  data: PropTypes.shape({}).isRequired,
};

export default AgeGroupChart;
