import React, { useState, useEffect, useCallback, FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';
import styled from 'styled-components';

import DatePickerConstraints from './datePickerConstraints';
import _DataTable from '../../components/DataTable';
import UtilityBar from '../../components/UtilityBar';
import { DataTableProps } from '../../components/DataTable/types';
import { displayErrors } from '../../components/ErrorParagraph';
import { H1 } from '../../components/Headings';
import { CommunityBusinesses } from '../../api';
import { DurationUnitEnum } from '../../types';
import useRequest from '../../hooks/useRequest';
import { useAggDataOnRes } from '../../hooks/useAggDataOnRes';
import Months from '../../util/months';
import { tableType } from '../../util/dataManipulation/tableType';
import { aggregatedToTableData } from '../../util/dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../../util/dataManipulation/downloadCsv';


const DataTable = styled(_DataTable)`
  margin-top: 4rem;
`;

const Container = styled(Grid)`
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100% !important;
`;

const TABLE_TITLE = 'Volunteer Time per Month';

const ByVolunteer: FunctionComponent<RouteComponentProps> = (props) => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [sortBy, setSortBy] = useState(`Total ${unit}`);
  const [volunteers, setVolunteers] = useState();
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
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
  useAggDataOnRes({
    data: { logs, volunteers },
    conditions: [logs, volunteers],
    updateOn: [logs, unit, volunteers],
    columnHeaders: ['Volunteer Name', ...Months.range(fromDate, toDate, Months.format.verbose)],
    setErrors,
    setAggData,
    tableType: tableType.MonthByName,
  });

  // manipulate data for table
  useEffect(() => {
    if (aggData) {
      setTableProps(aggregatedToTableData({ data: aggData, unit }));
    }
  }, [aggData]);

  const onChangeSortBy = useCallback((column: string) => {
    setSortBy(column);
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
            datePickerConstraint={DatePickerConstraints}
            onUnitChange={setUnit}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onDownloadClick={downloadCsv({ aggData, fromDate, toDate, setErrors, fileName: 'by_volunteer' })} // tslint:disable-line:max-line-length
          />
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={9}>
          {displayErrors(errors)}
          {
            tableProps && (
              <DataTable
                { ...tableProps }
                title={TABLE_TITLE}
                sortBy={sortBy}
                initialOrder="desc"
                onChangeSortBy={onChangeSortBy}
                showTotals
              />
            )
          }
        </Col>
      </Row>
    </Container>
  );
};

export default withRouter(ByVolunteer);
