import React, { useState } from 'react';
import moment from 'moment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 } from '../../components/Headings';

import { CommunityBusinesses } from '../../api';
import DataTable from '../../components/DataTable';
import UtilityBar from '../../components/UtilityBar';
import { DurationUnitEnum } from '../../types';
import useRequest from '../../util/hooks/useRequest';
import { DataTableProps } from '../../components/DataTable/types';

export default () => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [fromDate, setFromDate] = useState(moment().subtract(1, 'year').add(1, 'month').toDate());
  const [toDate, setToDate] = useState(moment().toDate());
  const [tableProps, setTableProps] = useState<DataTableProps>();

  const { error, loading, data } = useRequest({ // tslint:disable-line
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
  });

  return (
    <Grid>
      <Row center="xs">
        <Col>
          <H1>By Activity</H1>
          <UtilityBar
            dateFilter="month"
            onUnitChange={setUnit}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />
          {tableProps && <DataTable { ...tableProps } />}
        </Col>
      </Row>
    </Grid>
  );
};
