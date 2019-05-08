import React, { useState, useEffect, FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
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
import { displayErrors } from '../../components/ErrorParagraph';

const ByVolunteer: FunctionComponent<RouteComponentProps> = (props) => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [volunteers, setVolunteers] = useState();
  const [fromDate, setFromDate] = useState(Months.defaultFrom());
  const [toDate, setToDate] = useState(Months.defaultTo());
  const [tableProps, setTableProps] = useState<DataTableProps>();
  const [errors, setErrors] = useState();

  const { data: logs } = useRequest({
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
    setErrors,
    push: props.history.push,
  });

  // bit weird maybe
  useRequest({
    apiCall: CommunityBusinesses.getVolunteers,
    callback: setVolunteers,
    setErrors,
    push: props.history.push,
  });


  useEffect(() => {
    if (logs && volunteers) {
      setTableProps(logsToVolunteerTable({ data: { logs, volunteers }, unit, fromDate, toDate }));
      setErrors(null);
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
          {displayErrors(errors)}
          {tableProps && <DataTable { ...tableProps } />}
        </Col>
      </Row>
    </Grid>
  );
};

export default withRouter(ByVolunteer);
