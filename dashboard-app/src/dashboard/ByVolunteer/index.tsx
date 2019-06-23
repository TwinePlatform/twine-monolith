import React, { useState, useEffect, useCallback, FunctionComponent } from 'react';
import styled from 'styled-components';
import { Dictionary } from 'ramda';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';

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
import useAggregateDataByVolunteer from '../hooks/useAggregateDataByVolunteer';
import { getTitleForMonthPicker } from '../util';
import { LegendData } from '../../components/StackedBarChart/types';


/**
 * Styles
 */
const Container = styled(Grid)`
`;


/**
 * Helpers
 */
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
  const [errors, setErrors] = useState<Dictionary<string>>({});
  const [legendData, setLegendData] = useState<LegendData>([]);
  const { loading, data, error, months } =
    useAggregateDataByVolunteer({ from: fromDate, to: toDate });

  useEffect(() => {
    if (error) {
      setErrors({ data: error.message });
    }
  }, [error]);

  // manipulate data for table
  useEffect(() => {
    if (!loading && data && months) {
      setTableData(aggregatedToTableData({ data, unit, yData: months }));
    }
  }, [data, unit]);

  const onChangeSortBy = useCallback((column: string) => {
    const idx = tableData.headers.indexOf(column);
    if (idx > -1) {
      setSortBy(idx);
    }
  }, [tableData]);

  const downloadAsCsv = useCallback(() => {
    if (!loading && data) {
      downloadCsv({ data, fromDate, toDate, setErrors, fileName: 'by_activity', unit });
    } else {
      setErrors({ Download: 'No data available to download' });
    }
  }, [data, fromDate, toDate, unit]);

  const tabProps = {
    data,
    unit,
    tableData,
    sortBy,
    onChangeSortBy,
    title: getTitleForMonthPicker('Volunteer Time per month', fromDate, toDate),
    legendData,
    setLegendData,
  };

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>By Volunteer</H1>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={12}>
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

