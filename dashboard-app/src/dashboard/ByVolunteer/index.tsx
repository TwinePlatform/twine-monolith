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
import Months from '../../util/months';
import { displayErrors } from '../../components/ErrorParagraph';
import { useCreateAggDataOnRes } from '../../hooks/useCreateAggDataOnRes';
import { tableType } from '../../util/dataManipulation/tableType';
import { aggregatedToTableData } from '../../util/dataManipulation/aggregatedToTableData';


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
  const [aggData, setAggData] = useState();

  const { data: logs } = useRequest({
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
    setErrors,
    push: props.history.push,
  });

  // onload request
  useRequest({
    apiCall: CommunityBusinesses.getVolunteers,
    callback: setVolunteers,
    setErrors,
    push: props.history.push,
  });

  // manipulate data on response
  useCreateAggDataOnRes({
    data: { logs, volunteers },
    conditionals: [logs, volunteers],
    updateOn: [logs, unit, volunteers],
    columnHeaders: ['Volunteer Name', ...Months.range(fromDate, toDate)],
    setErrors,
    setAggData,
    unit,
    tableType: tableType.MonthByName,
  });

  // manipulate data for table
  useEffect(() => {
    if (aggData) {
      setTableProps(aggregatedToTableData({ title: 'Volunteer Activity over Months', data: aggData })); // tslint:disable:max-line-length
    }
  }, [aggData]);

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
