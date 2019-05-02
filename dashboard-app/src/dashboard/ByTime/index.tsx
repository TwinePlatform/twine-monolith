import React, { useEffect, useState } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 } from '../../components/Headings';
import { CommunityBusinesses } from '../../api';
import DataTable from '../../components/DataTable';
import { DataTableProps } from '../../components/DataTable/types';
import useRequest from '../../util/hooks/useRequest';
import { UnitEnum } from '../../types';
import DateRange from '../../util/dateRange';
import { timeLogsToTable } from './helper';

export default () => {
  const { error, loading, data } = useRequest({ apiCall: CommunityBusinesses.getLogs });
  const [unit, setUnit] = useState(UnitEnum.HOURS);
  const [months, setMonths] = useState(DateRange.months);


  const props: DataTableProps = {
    title: 'Volunteer Activity over Months',
    headers: ['Activity', `Total ${unit}`, ...months],
    rows: [],
  };

  if (!loading && data) {
    props.rows = timeLogsToTable({ data, months, unit });
  }

  return (
    <Grid>
      <Row center="xs">
        <Col>
          <H1>By Time</H1>
          {data && <DataTable {...props} />}
        </Col>
      </Row>
    </Grid>
  );
};
