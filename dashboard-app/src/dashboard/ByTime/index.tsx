import React, { useEffect, useState, useCallback, FunctionComponent } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';

import DatePickerConstraints from './datePickerConstraints';
import { CommunityBusinesses } from '../../api';
import _DataTable from '../../components/DataTable';
import UtilityBar from '../../components/UtilityBar';
import { FullScreenBeatLoader } from '../../components/Loaders';
import { H1 } from '../../components/Headings';
import useRequest from '../../hooks/useRequest';
import { DurationUnitEnum } from '../../types';
import Months from '../../util/months';
import { useAggDataOnRes } from '../../hooks/useAggDataOnRes';
import { aggregatedToTableData, TableData } from '../dataManipulation/aggregatedToTableData';
import { tableType } from '../dataManipulation/tableType';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import { ColoursEnum } from '../../styles/design_system';
import TimeTabs from './TimeTabs';
import Errors from '../../components/ErrorParagraph';

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
const TITLE = 'Volunteer Activity over Months';
const initTableData = { headers: [], rows: [] };


/**
 * Component
 */
const ByTime: FunctionComponent<RouteComponentProps> = (props) => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [sortBy, setSortBy] = useState(0);
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [errors, setErrors] = useState();
  const [aggData, setAggData] = useState();
  const [tableData, setTableData] = useState<TableData>(initTableData);

  // onload request
  const { data: logs, loading } = useRequest({
    apiCall: CommunityBusinesses.getLogs,
    params: { since: fromDate, until: toDate },
    updateOn: [fromDate, toDate],
    setErrors,
    push: props.history.push,
  });

  // manipulate data on response
  useAggDataOnRes({
    data: { logs },
    conditions: [logs],
    updateOn: [logs, unit],
    columnHeaders: ['Activity', ...Months.range(fromDate, toDate, Months.format.verbose)],
    setErrors,
    setAggData,
    tableType: tableType.MonthByActivity,
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

  const tabProps = { aggData, unit, tableData, sortBy, onChangeSortBy, TITLE };

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>By Time</H1>
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
      </Row>;
      <Errors errors={errors}/>
  { loading
  ? (<FullScreenBeatLoader color={ColoursEnum.purple}/>)
  : (<TimeTabs {...tabProps}
  />)
  }
    </Container>
  );
};

export default withRouter(ByTime);

