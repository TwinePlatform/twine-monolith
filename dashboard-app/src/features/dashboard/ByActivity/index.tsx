import React, { useEffect, useState, useCallback, FunctionComponent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';

import DatePickerConstraints from './datePickerConstraints';
import _DataTable from '../components/DataTable';
import UtilityBar from '../components/UtilityBar';
import { H1 } from '../../../lib/ui/components/Headings';
import { DataTableProps } from '../components/DataTable/types';
import { FullScreenBeatLoader } from '../../../lib/ui/components/Loaders';
import { DurationUnitEnum } from '../../../types';
import { aggregatedToTableData } from '../dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import { ColoursEnum } from '../../../lib/ui/design_system';
import Errors from '../components/Errors';
import useAggregateDataByActivity from './useAggregateDataByActivity';
import { TabGroup } from '../components/Tabs';
import { getTitleForDayPicker } from '../util';
import { useErrors } from '../../../lib/hooks/useErrors';


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
  const { loading, error, data, activities } =
    useAggregateDataByActivity({ from: fromDate, to: toDate });

  // set and clear errors on response
  const [errors, setErrors] = useErrors(error, data);

  // manipulate data for table
  useEffect(() => {
    if (!loading && data && activities) {
      setTableData(aggregatedToTableData({ data, unit, yData: activities }));
    }
  }, [data, unit]);

  const onChangeSortBy = useCallback((column: string) => {
    const idx = tableData.headers.indexOf(column);
    if (idx > -1) {
      setSortBy(idx);

      // Requirement: If column being selected for sorting is "Volunteer Name"
      //              (i.e. the first column), sort ascending (A-Z) instead of
      //              descending (Z-A)
      if (idx === 0) {
        return 'asc';
      }
    }
  }, [tableData]);

  const downloadAsCsv = useCallback(() => {
    if (!loading && data) {
      downloadCsv({ data, fromDate, toDate, setErrors, fileName: 'by_activity', unit });
    } else {
      setErrors({ Download: 'No data available to download' });
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
        <Col xs={12}>
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
              <Col xs={12}>
                <Errors errors={errors}/>
                <TabGroup titles={['Table']}>
                  {
                    tableData && (
                      <DataTable
                        {...tableData}
                        title={getTitleForDayPicker(TABLE_TITLE, fromDate, toDate)}
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
