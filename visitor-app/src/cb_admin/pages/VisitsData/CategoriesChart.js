import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Paragraph } from '../../../shared/components/text/base';
import HorizontalDrillDownChart from './HorizontalDrillDownChart';


const CategoriesChart = ({ categoryData, activityData, chartOptions, basis }) => {
  const [drillDown, setDrillDown] = useState(false);
  const [selected, setSelected] = useState('');

  const onReset = useCallback(() => {
    setSelected('');
    setDrillDown(false);
  }, []);

  const onClick = useCallback(([element]) => {
    if (!element) return;
    if (drillDown) return onReset(); // eslint-disable-line consistent-return
    setSelected(element._model.label); // eslint-disable-line no-underscore-dangle
    setDrillDown(true);
  }, [drillDown]);

  return (
    <>
      <Paragraph>
        {
          selected
            ? `Viewing ${selected}`
            : 'Viewing all categories'
        }
      </Paragraph>
      <Paragraph onClick={onReset}>
        {
          selected
            ? 'Click any bar to return to the original view or click here'
            : 'Click any bar to see the activities under that category'
        }
      </Paragraph>
      <HorizontalDrillDownChart
        drillDown={drillDown}
        selected={selected}
        levelOneData={categoryData}
        levelTwoData={activityData}
        options={chartOptions}
        onClick={onClick}
        basis={basis}

      />
    </>
  );
};

CategoriesChart.propTypes = {
  categoryData: PropTypes.shape({}).isRequired,
  activityData: PropTypes.shape({}).isRequired,
  chartOptions: PropTypes.shape({}).isRequired,
  basis: PropTypes.string.isRequired,
};

export default CategoriesChart;
