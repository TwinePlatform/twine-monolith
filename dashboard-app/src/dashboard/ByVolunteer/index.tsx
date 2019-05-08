import React, { useState, useEffect } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 } from '../../components/Headings';

import { CommunityBusinesses } from '../../api';
import DataTable from '../../components/DataTable';
import UtilityBar from '../../components/UtilityBar';
import { DurationUnitEnum } from '../../types';
import useRequest from '../../util/hooks/useRequest';
import { DataTableProps } from '../../components/DataTable/types';
import { logsToVolunteerTable } from './helper';
import Months from '../../util/months';

export default () => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [volunteers, setVolunteers] = useState();
  const [fromDate, setFromDate] = useState(Months.defaultFrom());
  const [toDate, setToDate] = useState(Months.defaultTo());
  const [tableProps, setTableProps] = useState<DataTableProps>();

  const { data: logs } = useRequest({
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
  });

  // bit weird maybe
  useRequest({
    apiCall: CommunityBusinesses.getVolunteers,
    callback: setVolunteers,
  });


  useEffect(() => {
    if (logs && volunteers) {
      setTableProps(logsToVolunteerTable({ data: { logs, volunteers }, unit, fromDate, toDate }));
    }
  }, [logs, unit, volunteers]); // TODO: have single on load variable for trigger

  return (
    <Grid>
      <Row center="xs">
        <Col>
          <H1>By Volunteer</H1>
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
