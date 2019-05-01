import React, { useEffect, useState } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 } from '../components/Headings';
import { CommunityBusinesses } from '../api';
import DataTable from '../components/DataTable';
import useRequestOnLoad from '../util/hooks/useRequestOnLoad';

export default () => {
  const { error, loading, data } = useRequestOnLoad(CommunityBusinesses.getLogs());

  return (
    <Grid>
      <Row center="xs">
        <Col>
          <H1>By Time</H1>
        </Col>
      </Row>
    </Grid>
  );
};
