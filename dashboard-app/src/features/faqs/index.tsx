import React, { FunctionComponent } from 'react';
import { withRouter } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Accordion } from './components/Accordion';
import { H1 } from '../../lib/ui/components/Headings';
import copy from '../dashboard/copy/faqs';

const FAQPage: FunctionComponent = () => (
  <Grid>
    <Row center="xs">
      <Col xs={9}>
        <H1>Frequently Asked Questions</H1>
      </Col>
    </Row>
    <Row center="xs">
      <Col xs={9}>
        <Accordion panels={copy} />
      </Col>
    </Row>
  </Grid>
);

export default withRouter(FAQPage);
