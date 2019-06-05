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
  data: AggregatedData;
  unit: DurationUnitEnum;
  tableData: TableData;
  sortBy: number;
  onChangeSortBy: (x: string) => void;
  title: string;
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
const VolunteerTabs: FunctionComponent<Props> = (props) => {
  const { data, unit, tableData, sortBy, onChangeSortBy, title } = props;

  return(
    <Row center="xs">
      <Col xs={12}>
        <TabGroup titles={['Chart', 'Table']}>
          {
            data && (
              <StackedBarChart
                title={title}
                data={aggregatedToStackedGraph(data, unit)}
                xAxisTitle={'Months'}
                yAxisTitle={`Volunteer ${unit}`}
              />
            )
          }
          {
            tableData && (
              <DataTable
                {...tableData}
                title={title}
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
  );
};

export default VolunteerTabs;

