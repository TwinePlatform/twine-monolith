import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { H3, BottomChartRow } from './components';
import GenderChart from './charts/GenderChart';
import AgeGroupChart from './charts/AgeGroupChart';

const TabDemographics = ({ basis, data }) => (
  <Grid>
    <Row center="xs">
      <Col xs={6}>
        <H3>{basis} by gender</H3>
        <GenderChart data={data.gender} />
      </Col>
    </Row>
    <BottomChartRow center="xs">
      <Col xs={6}>
        <H3>{basis} by age</H3>
        <AgeGroupChart data={data.age} />
      </Col>
    </BottomChartRow>
  </Grid>);

TabDemographics.propTypes = {
  basis: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
};

export default TabDemographics;
