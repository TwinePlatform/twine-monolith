import React, { useState, useEffect, useCallback, FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';
import styled from 'styled-components';

import DatePickerConstraints from './datePickerConstraints';
import UtilityBar from '../../components/UtilityBar';
import { FullScreenBeatLoader } from '../../components/Loaders';
import { H1 } from '../../components/Headings';
import { CommunityBusinesses } from '../../api';
import { DurationUnitEnum } from '../../types';
import useRequest from '../../hooks/useRequest';
import { useAggDataOnRes } from '../../hooks/useAggDataOnRes';
import Months from '../../util/months';
import { tableType } from '../dataManipulation/tableType';
import { aggregatedToTableData, TableData } from '../dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import { ColoursEnum } from '../../styles/design_system';
import VolunteerTabs from './VolunteerTabs';
import Errors from '../../components/Errors';

/**
 * Styles
 */

const Container = styled(Grid)`
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100% !important;
`;


/**
 * Helpers
 */
const TITLE = 'Volunteer Time per Month';
const initTableData = { headers: [], rows: [] };


/**
 * Component
 */
const ByVolunteer: FunctionComponent<RouteComponentProps> = (props) => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [sortBy, setSortBy] = useState(1);
  const [volunteers, setVolunteers] = useState();
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const [errors, setErrors] = useState();
  const [aggData, setAggData] = useState();

  const { data: logs, loading: loadingLogs } = useRequest({
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
    setErrors,
    push: props.history.push,
  });

  // onload request
  const { loading: loadingVols } = useRequest({
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
      setTableData(aggregatedToTableData({ data: aggData, unit }));
    }
  }, [aggData]);

  const onChangeSortBy = useCallback((column: string) => {
    const idx = tableData.headers.indexOf(column);
    if (idx > -1) {
      setSortBy(idx);
    }
  }, [tableData]);

  const downloadAsCsv = useCallback(() => {
    downloadCsv({ aggData, fromDate, toDate, setErrors, fileName: 'by_activity', unit });
  }, [aggData, fromDate, toDate, unit]);

  const tabProps = { aggData, unit, tableData, sortBy, onChangeSortBy, title: TITLE };

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
            onDownloadClick={downloadAsCsv}
          />
        </Col>
      </Row>
      <Errors errors={errors}/>
      { loadingLogs || loadingVols
      ? (<FullScreenBeatLoader color={ColoursEnum.purple}/>)
      : (<VolunteerTabs {...tabProps}/>)}
    </Container>
  );
};

export default withRouter(ByVolunteer);

