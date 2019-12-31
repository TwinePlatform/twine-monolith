import React from 'react';
import PropTypes from 'prop-types';
import { HorizontalBar } from 'react-chartjs-2';
import Overlay from '../Overlay';
import { isChartJsDataEmpty } from '../util';


const HorizontalDrillDownChart = props => (
  <Overlay content="No data available" isVisible={isChartJsDataEmpty(props.levelOneData)}>
    <HorizontalBar
      data={props.drillDown ? props.levelTwoData[props.selected] || {} : props.levelOneData}
      options={{
        legend: { display: false },
        scales: {
          xAxes: [{
            gridLines: { display: false },
            ticks: {
              beginAtZero: true,
              padding: 5,
              stepSize: props.options.stepSize,
            },
            scaleLabel: {
              labelString: `Number of ${props.basis}`,
              display: true,
            },
          }],
          yAxes: [{
            gridLines: { display: false },
          }],
        },
      }}
      getElementAtEvent={props.onClick}
    />
  </Overlay>
);

HorizontalDrillDownChart.propTypes = {
  drillDown: PropTypes.bool.isRequired,
  selected: PropTypes.string.isRequired,
  levelOneData: PropTypes.shape({}).isRequired,
  levelTwoData: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({ stepSize: PropTypes.number }),
  onClick: PropTypes.func.isRequired,
  basis: PropTypes.string.isRequired,
};

HorizontalDrillDownChart.defaultProps = {
  options: { stepSize: 2 },
};

export default HorizontalDrillDownChart;
