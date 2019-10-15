import React, { useEffect, useState, useCallback, FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';

import DatePickerConstraints from './datePickerConstraints';
import UtilityBar from '../components/UtilityBar';
import ProjectActivityToggle from '../components/ProjectActivityToggle';
import { FullScreenBeatLoader } from '../../../lib/ui/components/Loaders';
import { H1 } from '../../../lib/ui/components/Headings';
import { aggregatedToTableData, TableData } from '../dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import { ColoursEnum } from '../../../lib/ui/design_system';
import ProjectTabs from './ProjectTabs';
import Errors from '../components/Errors';
import useAggregateDataByProject from './useAggregateDataByProject';
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
  const [legendData, setLegendData] = useState<LegendData>([]);
  const { data, loading, error, activities } =
    useAggregateDataByProject({ from: fromDate, to: toDate });

  // set and clear errors on response
  const [errors, setErrors] = useErrors(error, data);

  // manipulate data for table
  useEffect(() => {
    if (!loading && data && activities) {
      setTableData(aggregatedToTableData({ data, unit, yData: activities }));
    }
  }, [data, unit, loading, activities]);

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
      downloadCsv({ data, fromDate, toDate, fileName: 'projects', unit, orderable })
        .catch((error) => setErrors({ Download: error.message }));
    } else {
      setErrors({ Download: 'No data available to download' });
    }
  }, [data, fromDate, toDate, orderable, loading, unit, setErrors]);

  const tabProps = {
    data,
    tableData,
    onChangeSortBy,
    title: getTitleForMonthPicker(TitlesCopy.Projects.subtitle, fromDate, toDate),
    legendData,
    setLegendData,
    orderable,
  };

  return (
    <Container>
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Projects.title}</H1>
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
            customToggle={<ProjectActivityToggle active="project" onChange={() => {}} />}
          />
        </Col>
      </Row>
      <Errors errors={errors} />
      {
        loading
          ? <FullScreenBeatLoader color={ColoursEnum.purple} />
          : <ProjectTabs {...tabProps} />
      }
    </Container>
  );
};

export default withRouter(ByTime);

