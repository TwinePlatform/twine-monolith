import React, { useState, useEffect, useCallback, FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';
import styled from 'styled-components';

import DatePickerConstraints from './datePickerConstraints';
import UtilityBar from '../../components/UtilityBar';
import { FullScreenBeatLoader } from '../../components/Loaders';
import { H1 } from '../../components/Headings';
import { DurationUnitEnum } from '../../types';
import { aggregatedToTableData, TableData } from '../dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import { ColoursEnum } from '../../styles/design_system';
import VolunteerTabs from './VolunteerTabs';
import Errors from '../../components/Errors';
import useAggregatedDataByVolunteer from '../hooks/useAggregatedDataByVolunteer';


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
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const [errors, setErrors] = useState();
  const { loading, data, error } = useAggregatedDataByVolunteer({ from: fromDate, to: toDate });

  useEffect(() => {
    if (error) {
      setErrors({ data: error.message });
    }
  }, [error]);

  // manipulate data for table
  useEffect(() => {
    if (data) {
      setTableData(aggregatedToTableData({ data, unit }));
    }
  }, [data, unit]);

  const onChangeSortBy = useCallback((column: string) => {
    const idx = tableData.headers.indexOf(column);
    if (idx > -1) {
      setSortBy(idx);
    }
  }, [tableData]);

  const downloadAsCsv = useCallback(() => {
    downloadCsv({ aggData: data, fromDate, toDate, setErrors, fileName: 'by_activity', unit });
  }, [data, fromDate, toDate, unit]);

  const tabProps = { aggData: data, unit, tableData, sortBy, onChangeSortBy, title: TITLE };

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
      {
        loading
          ? <FullScreenBeatLoader color={ColoursEnum.purple}/>
          : <VolunteerTabs {...tabProps}/>
      }
    </Container>
  );
};

export default withRouter(ByVolunteer);

