import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';

import _DataTable from '../../components/DataTable';
import { aggregatedToStackedGraph } from '../dataManipulation/aggregatedToGraphData';
import { TabGroup } from '../../components/Tabs';
import { AggregatedData } from '../dataManipulation/logsToAggregatedData';
import { DurationUnitEnum } from '../../types';
import { TableData } from '../dataManipulation/aggregatedToTableData';
import StackedBarChart from '../../components/StackedBarChart/index';

/*
 * Types
 */

interface Props {
  aggData: AggregatedData;
  unit: DurationUnitEnum;
  tableData: TableData;
  sortBy: number;
  onChangeSortBy: (x: string) => void;
  TITLE: string;
}

/*
 * Styles
 */
const DataTable = styled(_DataTable)`
  margin-top: 4rem;
`;

/*
 * Component
 */
const TimeTabs: FunctionComponent<Props> = (props) => {
  const { aggData, unit, tableData, sortBy, onChangeSortBy, TITLE } = props;

  return(
  <TabGroup titles={['Chart', 'Table']}>
      {aggData && <StackedBarChart
        title={TITLE}
        data={aggregatedToStackedGraph(aggData, unit)}
        xAxisTitle={'Months'}
        yAxisTitle={`Volunteer ${unit}`}/>}
  <Row center="xs">
    <Col xs={12}>
      { tableData && (<DataTable
        {...tableData}
        title={TITLE}
        sortBy={tableData.headers[sortBy]}
        initialOrder="asc"
        onChangeSortBy={onChangeSortBy}
        showTotals
      />
      )}
    </Col>
  </Row>
</TabGroup>);
};

export default TimeTabs;

