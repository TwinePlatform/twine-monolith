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
import { getTitleForDayPicker, toggleOrder } from '../util';
import { useErrors } from '../../../lib/hooks/useErrors';
import { TitlesCopy } from '../copy/titles';
import { Order } from 'twine-util/arrays';


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
const initTableData = { headers: [], rows: [] };


/**
 * Component
 */
const ByActivity: FunctionComponent<RouteComponentProps> = () => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [sortBy, setSortBy] = useState(1);
  const [order, setOrder] = useState<Order>('desc');
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

      // setSortBy((prevIndex) => {
      // if (idx === sortBy) setOrder((prev) => toggleOrder(prev));
        // return idx;
      // });
      setSortBy(idx);
      console.log({ idx, sortBy });

    }
  }, [tableData]);

  const downloadAsCsv = useCallback(() => {
    if (!loading && data) {
      downloadCsv({ data, fromDate, toDate, fileName: 'activity', unit, sortBy })
        .catch((error) => setErrors({ Download: error.message }));
    } else {
      setErrors({ Download: 'No data available to download' });
    }
  }, [data, fromDate, toDate, unit, sortBy]);

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Activities.title}</H1>
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
                        title={getTitleForDayPicker(TitlesCopy.Activities.subtitle, fromDate, toDate)} // tslint:disable:max-line-length
                        sortBy={tableData.headers[sortBy]}
                        order={order}
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
