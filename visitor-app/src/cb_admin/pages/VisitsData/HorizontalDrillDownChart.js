import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { HorizontalBar } from 'react-chartjs-2';


const HorizontalDrillDownChart = (props) => {
  const [drillDown, setDrillDown] = useState(false);
  const [selected, setSelected] = useState('');

  const onClick = useCallback(([element]) => {
    if (!element) return;
    setSelected(drillDown ? '' : element._model.label); // eslint-disable-line no-underscore-dangle
    setDrillDown(!drillDown);
  });

  return (
    <HorizontalBar
      data={drillDown ? props.levelTwoData[selected] || {} : props.levelOneData}
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
          }],
          yAxes: [{
            gridLines: { display: false },
          }],
        },
      }}
      getElementAtEvent={onClick}
    />
  );
};

HorizontalDrillDownChart.propTypes = {
  levelOneData: PropTypes.shape({}).isRequired,
  levelTwoData: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({ stepSize: PropTypes.number }),
};

HorizontalDrillDownChart.defaultProps = {
  options: { stepSize: 2 },
};

export default HorizontalDrillDownChart;
