import React, { useEffect, useState, useCallback, FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { H1 } from '../../../lib/ui/components/Headings';
import { useErrors } from '../../../lib/hooks/useErrors';
import { LoadingBoundary } from '../../../lib/ui/components/Boundaries';
import DataTable from '../components/DataTable';
import { TabGroup } from '../components/Tabs';
import StackedBarChart from '../components/StackedBarChart';
import { LegendData } from '../components/StackedBarChart/types';
import UtilityBar from '../components/UtilityBar';
import ProjectActivityToggle from '../components/ProjectActivityToggle';
import Errors from '../components/Errors';
import { aggregatedToTableData, TableData } from '../dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import useAggregateDataByProject from './useAggregateDataByProject';
import DatePickerConstraints from './datePickerConstraints';
import { getTitleForMonthPicker } from '../util';
import { TitlesCopy } from '../copy/titles';
import { useOrderable } from '../hooks/useOrderable';
import { DashboardContext } from '../context';
import { GraphColourList, GraphColoursEnum } from '../../../lib/ui/design_system';
import useToggleActiveData from './useToggleActiveData';


/**
 * Helpers
 */
const initTableData = { headers: [], rows: [] };

/**
 * Component
 */
const ByProjects: FunctionComponent<RouteComponentProps> = () => {
  const { unit } = useContext(DashboardContext);
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const [colours, setColours] = useState<GraphColoursEnum[]>([]);
  const {
    active,
    setActive,
    actual: legendData,
    setActual: setLegendData,
  } = useToggleActiveData<LegendData, 'Projects' | 'Activities'>({
    left: 'Projects',
    right: 'Activities',
    initSide: 'Projects',
    initState: [],
  });
  const { data, loading, error, yData } =
    useAggregateDataByProject({ from: fromDate, to: toDate, independentVar: active });

  // set and clear errors on response
  const [errors, setErrors] = useErrors(error, data);

  // manipulate data for table
  useEffect(() => {
    if (!loading && data && yData) {
      setTableData(aggregatedToTableData({ data, unit, yData }));
    }
  }, [data, unit, loading, yData]);

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

  // Setting the colours directly using a ternary in the tab props
  // leads to a render loop, for reasons that are not yet well understood
  // So instead, we keep track of the _in use_ colour set in its own state
  // fragment
  useEffect(() => {
    if (active === 'Activities') {
      setColours([...GraphColourList].reverse());
    } else {
      setColours([...GraphColourList]);
    }
  }, [active])

  return (
    <Grid>
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Projects.title}</H1>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={12}>
          <UtilityBar
            dateFilter="day"
            datePickerConstraint={DatePickerConstraints}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onDownloadClick={downloadAsCsv}
            customToggle={<ProjectActivityToggle active={active} onChange={setActive} />}
          />
        </Col>
      </Row>
      <Errors errors={errors} />
      <LoadingBoundary isLoading={loading} fullscreen>
        <Row center="xs">
          <Col xs={12}>
            <TabGroup titles={['Chart', 'Table']}>
              {
                data && (
                  <StackedBarChart
                    title={getTitleForMonthPicker(TitlesCopy.Projects.subtitle, fromDate, toDate)}
                    data={data}
                    xAxisTitle={active === 'Activities' ? 'Projects' : 'Activities'}
                    yAxisTitle={`Volunteer ${unit}`}
                    colours={colours}
                    legendData={legendData}
                    setLegendData={setLegendData}
                    defaultSelection={true}
                  />
                )
              }
              {
                tableData && (
                  <DataTable
                    {...tableData}
                    title={getTitleForMonthPicker(TitlesCopy.Projects.subtitle, fromDate, toDate)}
                    order={orderable.order}
                    sortBy={tableData.headers[orderable.sortByIndex]}
                    onChangeSortBy={onChangeSortBy}
                    showTotals
                  />
                )
              }
            </TabGroup>
          </Col>
        </Row>
      </LoadingBoundary>
    </Grid>
  );
};

export default withRouter(ByProjects);

