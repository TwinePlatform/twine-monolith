import React, { useEffect, useState, useCallback, FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';

import DatePickerConstraints from './datePickerConstraints';
import _DataTable from '../../components/DataTable';
import UtilityBar from '../../components/UtilityBar';
import { H1 } from '../../components/Headings';
import { DataTableProps } from '../../components/DataTable/types';
import { FullScreenBeatLoader } from '../../components/Loaders';
import { displayErrors } from '../../components/ErrorParagraph';
import { CommunityBusinesses } from '../../api';
import { DurationUnitEnum } from '../../types';
import useRequest from '../../hooks/useRequest';
import { useAggDataOnRes } from '../../hooks/useAggDataOnRes';
import { tableType } from '../dataManipulation/tableType';
import { aggregatedToTableData } from '../dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import { ColoursEnum } from '../../styles/design_system';


/**
 * Types
 */
type TableData = Pick<DataTableProps, 'headers' | 'rows'>;


/**
 * Styles
 */
const DataTable = styled(_DataTable)`
  margin-top: 4rem;
`;

const Container = styled(Grid)`
  margin-left: 0 !important;
  margin-right: 0 !important;
  width: 100% !important;
`;


/**
 * Helpers
 */
const TABLE_TITLE = 'Volunteer time on activities';
const initTableData = { headers: [], rows: [] };


/**
 * Component
 */
const ByActivity: FunctionComponent<RouteComponentProps> = (props) => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [sortBy, setSortBy] = useState(1);
  const [activities, setActivities] = useState([]);
  const [volunteers, setVolunteers] = useState();
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const [aggData, setAggData] = useState();
  const [errors, setErrors] = useState();

  // Onload requests
  const { data: logs, loading: loadingLogs } = useRequest({
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
    setErrors,
    push: props.history.push,
  });

  const { loading: loadingAct } = useRequest({
    apiCall: CommunityBusinesses.getVolunteerActivities,
    callback: (data) => setActivities(data.map((x: any) => x.name)),
    setErrors,
    push: props.history.push,
  });

  const { loading: loadingVols } = useRequest({
    apiCall: CommunityBusinesses.getVolunteers,
    callback: setVolunteers,
    setErrors,
    push: props.history.push,
  });

  // manipulate data on response
  useAggDataOnRes({
    data: { logs, volunteers },
    conditions: [logs, activities, volunteers],
    updateOn: [logs, unit, activities, volunteers],
    columnHeaders: ['Volunteer Name', ...activities],
    setErrors,
    setAggData,
    tableType: tableType.ActivityByName,
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

  if (loadingLogs || loadingAct || loadingVols) {
    return (
      <FullScreenBeatLoader color={ColoursEnum.purple}/>
    );
  }

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>By Activity</H1>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={9}>
          <UtilityBar
            dateFilter="day"
            datePickerConstraint={DatePickerConstraints}
            onUnitChange={setUnit}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onDownloadClick={downloadAsCsv}
          />
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={9}>
          {displayErrors(errors)}
          {
            tableData && (
              <DataTable
                {...tableData}
                title={TABLE_TITLE}
                sortBy={tableData.headers[sortBy]}
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

export default withRouter(ByActivity);
