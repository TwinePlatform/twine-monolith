import React, { useState, useEffect, useCallback, FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';
import styled from 'styled-components';
import { assoc } from 'ramda';

import { H1 } from '../../components/Headings';
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

const Container = styled(Grid)`
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100% !important;
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

  const onChangeSortBy = useCallback((column: string) => {
    setTableProps(assoc('sortBy', column, tableProps));
  }, [tableProps]);

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>By Volunteer</H1>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={9}>
          <UtilityBar
            dateFilter="month"
            onUnitChange={setUnit}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
          />
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={9}>
          {displayErrors(errors)}
          {
            tableProps && (
              <DataTable { ...tableProps } initialOrder="desc" onChangeSortBy={onChangeSortBy} />
            )
          }
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(ByVolunteer);
