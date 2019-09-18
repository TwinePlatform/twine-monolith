import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

export default () => (
  <Grid>
    <Row>
      <Col xs={12}>
        <h1>404 page not found</h1>
      </Col>
    </Row>
    <Row>
      <Col xs={12}>
        <h2>We are sorry, but the page you a looking for does not exist.</h2>
      </Col>
    </Row>
  </Grid>
);
