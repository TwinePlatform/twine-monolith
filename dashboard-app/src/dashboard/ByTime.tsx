import React, { useEffect, useState } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 } from '../components/Headings';
import { CommunityBusinesses } from '../api';
import DataTable from '../components/DataTable';
import useRequestOnLoad from '../util/hooks/useRequestOnLoad';
import { UnitEnum } from '../types';

export default () => {
  const { error, loading, data } = useRequestOnLoad(CommunityBusinesses.getLogs());
  const [unit, setUnit] = useState(UnitEnum.HOURS);
  const [months, setMonths] = useState([]);
  const props = {
    title: 'Volunteer Activity over Months',
    headers: ['Activity', `Total ${unit}`, ...months],
    rows: [],
  };

  return (
    <Grid>
      <Row center="xs">
        <Col>
          <H1>By Time</H1>
          <DataTable {...props} />
        </Col>
      </Row>
    </Grid>
  );
};
