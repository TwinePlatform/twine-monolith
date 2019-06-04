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
import { DurationUnitEnum } from '../../types';
import { aggregatedToTableData } from '../dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import { ColoursEnum } from '../../styles/design_system';
import Errors from '../../components/Errors';
import useAggregatedDataByActivity from '../hooks/useAggregatedDataByActivity';
import { TabGroup } from '../../components/Tabs';


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
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const [errors, setErrors] = useState();
  const { loading, error, data } = useAggregatedDataByActivity({ from: fromDate, to: toDate });

  useEffect(() => {
    if (error) {
      setErrors({ data: error.message });
    }
  }, [error]);

  // manipulate data for table
  useEffect(() => {
    if (!loading && data) {
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
    if (!loading && data) {
      downloadCsv({ aggData: data, fromDate, toDate, setErrors, fileName: 'by_activity', unit });
    }
  }, [data, fromDate, toDate, unit]);

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
      {
        loading
          ? (<FullScreenBeatLoader color={ColoursEnum.purple}/>)
          : (
            <Row center="xs">
              <Col xs={9}>
                <Errors errors={errors}/>
                <TabGroup titles={['Table']}>
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
                </TabGroup>
              </Col>
            </Row>
          )
      }
    </Container>
  );
};

export default withRouter(ByActivity);
