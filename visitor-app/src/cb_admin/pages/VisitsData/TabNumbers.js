import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';

import TimePeriodChart from './charts/TimePeriodChart';
import CategoriesChart from './charts/CategoriesChart';
import { H3, BottomChartRow } from './components';

const TabNumbers = ({ data, charts, basis, filterString }) => (
  <Grid>
    <Row center="xs">
      <Col xs={8}>
        <H3>{basis} over {filterString}</H3>
        <TimePeriodChart data={data.time} options={charts.time} />
      </Col>
    </Row>
    <BottomChartRow center="xs">
      <Col xs={8}>
        <H3>Reason for visiting</H3>
        <CategoriesChart
          categoryData={data.category}
          activityData={data.activity}
          chartOptions={charts.category}
          basis={basis}
        />
      </Col>
    </BottomChartRow>
  </Grid>);

TabNumbers.propTypes = {
  filterString: PropTypes.string.isRequired,
  basis: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
  charts: PropTypes.shape({}).isRequired,
};

export default TabNumbers;
