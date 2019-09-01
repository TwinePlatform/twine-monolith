import React, { useEffect, useState, useCallback, FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';

import DatePickerConstraints from './datePickerConstraints';
import UtilityBar from '../components/UtilityBar';
import { FullScreenBeatLoader } from '../../../lib/ui/components/Loaders';
import { H1 } from '../../../lib/ui/components/Headings';
import { aggregatedToTableData, TableData } from '../dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import { ColoursEnum } from '../../../lib/ui/design_system';
import TimeTabs from './TimeTabs';
import Errors from '../components/Errors';
import useAggregateDataByTime from './useAggregateDataByTime';
import { getTitleForMonthPicker } from '../util';
import { LegendData } from '../components/StackedBarChart/types';
import { useErrors } from '../../../lib/hooks/useErrors';
import { TitlesCopy } from '../copy/titles';
import { useOrderable } from '../hooks/useOrderable';
import { DashboardContext } from '../../../App';


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
const ByTime: FunctionComponent<RouteComponentProps> = () => {
  const { unit } = useContext(DashboardContext);
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const [title, setTitle] = useState<[string, string]>(['', '']);
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
  }, [data, unit, loading, months]);

  // get sorting state values
  const { orderable, onChangeOrderable } = useOrderable({
    initialOrderable: { sortByIndex: 0, order: 'asc' },
    updateOn: [tableData]
  });

  const onChangeSortBy = useCallback((column: string) => {
    const idx = tableData.headers.indexOf(column);
    onChangeOrderable(idx);
  }, [tableData.headers, onChangeOrderable]);

  const downloadAsCsv = useCallback(() => {
    if (!loading && data) {
      downloadCsv({ data, fromDate, toDate, fileName: 'time', unit, orderable })
        .catch((error) => setErrors({ Download: error.message }));
    } else {
      setErrors({ Download: 'No data available to download' });
    }
  }, [data, fromDate, toDate, orderable, loading, unit, setErrors]);

  useEffect(() => {
    setTitle(getTitleForMonthPicker(TitlesCopy.Time.subtitle, fromDate, toDate));
  }, [fromDate, toDate]);

  const tabProps = {
    data,
    tableData,
    onChangeSortBy,
    title,
    legendData,
    setLegendData,
    orderable,
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
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onDownloadClick={downloadAsCsv}
          />
        </Col>
      </Row>
      <Errors errors={errors} />
      {
        loading
          ? <FullScreenBeatLoader color={ColoursEnum.purple} />
          : <TimeTabs {...tabProps} />
      }
    </Container>
  );
};

export default withRouter(ByTime);

