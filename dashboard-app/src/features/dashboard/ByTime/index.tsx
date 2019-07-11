import React, { useEffect, useState, useCallback, FunctionComponent } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';

import DatePickerConstraints from './datePickerConstraints';
import _DataTable from '../components/DataTable';
import UtilityBar from '../components/UtilityBar';
import { FullScreenBeatLoader } from '../../../lib/ui/components/Loaders';
import { H1 } from '../../../lib/ui/components/Headings';
import { DurationUnitEnum } from '../../../types';
import { aggregatedToTableData, TableData } from '../dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import { ColoursEnum } from '../../../lib/ui/design_system';
import TimeTabs from './TimeTabs';
import Errors from '../components/Errors';
import useAggregateDataByTime from './useAggregateDataByTime';
import { getTitleForMonthPicker, toggleOrder } from '../util';
import { LegendData } from '../components/StackedBarChart/types';
import { useErrors } from '../../../lib/hooks/useErrors';
import { TitlesCopy } from '../copy/titles';
import { Order } from 'twine-util/arrays';


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
const ByTime: FunctionComponent<RouteComponentProps> = (props) => {
  const [unit, setUnit] = useState(DurationUnitEnum.HOURS);
  const [sortBy, setSortBy] = useState(0);
  const [order, setOrder] = useState<Order>('desc');
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const [legendData, setLegendData] = useState<LegendData>([]);
  const { data, loading, error, months } =
    useAggregateDataByTime({ from: fromDate, to: toDate });

  // set and clear errors on response
  const [errors, setErrors] = useErrors(error, data);

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
      setOrder((prev) => toggleOrder(prev));
    }
  }, [tableData]);

  const downloadAsCsv = useCallback(() => {
    if (!loading && data) {
      downloadCsv({ data, fromDate, toDate, fileName: 'time', unit, sortBy })
        .catch((error) => setErrors({ Download: error.message }));
    } else {
      setErrors({ Download: 'No data available to download' });
    }
  }, [data, fromDate, toDate, unit, sortBy]);

  const tabProps = {
    data,
    unit,
    tableData,
    sortBy,
    onChangeSortBy,
    title: getTitleForMonthPicker(TitlesCopy.Time.subtitle, fromDate, toDate),
    legendData,
    setLegendData,
    order,
  };

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Time.title}</H1>
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
          ? <FullScreenBeatLoader color={ColoursEnum.purple} />
          : <TimeTabs {...tabProps} />
      }
    </Container>
  );
};

export default withRouter(ByTime);

