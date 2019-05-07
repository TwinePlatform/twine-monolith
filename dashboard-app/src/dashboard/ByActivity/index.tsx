import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 } from '../../components/Headings';

import { CommunityBusinesses } from '../../api';
import DataTable from '../../components/DataTable';
import UtilityBar from '../../components/UtilityBar';
import { DurationUnitEnum } from '../../types';
import useRequest from '../../util/hooks/useRequest';
import { DataTableProps } from '../../components/DataTable/types';
import { activityLogsToTable } from './helper';

export default () => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [activities, setActivities] = useState();
  const [volunteers, setVolunteers] = useState();
  const [fromDate, setFromDate] = useState(moment().subtract(1, 'year').add(1, 'month').toDate());
  const [toDate, setToDate] = useState(moment().toDate());
  const [tableProps, setTableProps] = useState<DataTableProps>();

  const { data: logs } = useRequest({
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
  });

  // bit weird maybe
  useRequest({
    apiCall: CommunityBusinesses.getVolunteerActivities,
    callback: (data) => setActivities(data.map((x: any) => x.name)),
  });

  // bit weird maybe
  useRequest({
    apiCall: CommunityBusinesses.getVolunteers,
    callback: setVolunteers,
  });


  useEffect(() => {
    if (logs && activities && volunteers) {
      const columnHeaders = ['Volunteer Name'].concat(activities);
      setTableProps(activityLogsToTable({ data: { logs, volunteers }, columnHeaders, unit }));
    }
  }, [logs, unit, activities, volunteers]); // TODO: have single on load variable for trigger

  if (tableProps) {
    console.log(tableProps);
  }
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
