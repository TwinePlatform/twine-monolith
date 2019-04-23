import React, { useEffect } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 } from '../components/Headings';

import { CommunityBusinesses } from '../api';

export default () => {
  useEffect(() => {
    CommunityBusinesses.getLogs();
  }, []);

  return (
    <Grid>
      <Row center="xs">
        <Col>
          <H1>By Volunteer</H1>
        </Col>
      </Row>
    </Grid>
  );
};
