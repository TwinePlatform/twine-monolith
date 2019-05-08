import React, { useState, useEffect, FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';
import moment from 'moment';
import styled from 'styled-components';


import { H1 as _H1 } from '../../components/Headings';
import { CommunityBusinesses } from '../../api';
import _DataTable from '../../components/DataTable';
import UtilityBar from '../../components/UtilityBar';
import { DurationUnitEnum } from '../../types';
import useRequest from '../../hooks/useRequest';
import { DataTableProps } from '../../components/DataTable/types';
import { logsToVolunteerTable } from './helper';
import Months from '../../util/months';
import { displayErrors } from '../../components/ErrorParagraph';


const DataTable = styled(_DataTable)`
  margin-top: 4rem;
`;

const H1 = styled(_H1)`
  margin-top: 6rem;
`;

const ByVolunteer: FunctionComponent<RouteComponentProps> = (props) => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [volunteers, setVolunteers] = useState();
  const [fromDate, setFromDate] = useState(Months.defaultFrom());
  const [toDate, setToDate] = useState(Months.defaultTo());
  const [tableProps, setTableProps] = useState<DataTableProps | null>();
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
      setErrors(null);
      const tProps = logsToVolunteerTable({ data: { logs, volunteers }, unit, fromDate, toDate, setErrors }); // tslint:disable:max-line-length
      setTableProps(tProps);
    }
  }, [logs, unit, volunteers]); // TODO: have single on load variable for trigger

  return (
    <Grid>
      <Row center="xs">
        <Col>
          <H1>By Volunteer</H1>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={8}>
          <UtilityBar
            dateFilter="month"
            onUnitChange={setUnit}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={8}>
          {displayErrors(errors)}
          {tableProps && <DataTable { ...tableProps } initialOrder="desc" />}
        </Col>
      </Row>
    </Grid>
  );
};

export default withRouter(ByVolunteer);
