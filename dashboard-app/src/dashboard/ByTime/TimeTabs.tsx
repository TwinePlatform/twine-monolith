import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';

import _DataTable from '../../components/DataTable';
import { TabGroup } from '../../components/Tabs';
import { AggregatedData, IdAndName } from '../dataManipulation/logsToAggregatedData';
import { DurationUnitEnum } from '../../types';
import { TableData } from '../dataManipulation/aggregatedToTableData';
import StackedBarChart from '../../components/StackedBarChart/index';

/*
 * Types
 */

interface Props {
  data?: AggregatedData;
  legendOptions: IdAndName[];
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
`;

/*
 * Component
 */
const TimeTabs: FunctionComponent<Props> = (props) => {
  const { data, unit, tableData, sortBy, onChangeSortBy, title, legendOptions } = props;

  return(
    <Row center="xs">
      <Col xs={12}>
        <TabGroup titles={['Chart', 'Table']}>
          {
            data && (
              <StackedBarChart
                legendOptions={legendOptions}
                title={title}
                data={data}
                unit={unit}
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
                initialOrder="asc"
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

export default TimeTabs;

