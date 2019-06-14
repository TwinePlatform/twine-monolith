import React, { FunctionComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';

import DataTable from '../../components/DataTable';
import { TabGroup } from '../../components/Tabs';
import { AggregatedData } from '../dataManipulation/logsToAggregatedData';
import { DurationUnitEnum } from '../../types';
import { TableData } from '../dataManipulation/aggregatedToTableData';
import StackedBarChart from '../../components/StackedBarChart/index';


/*
 * Types
 */
interface Props {
  data?: AggregatedData;
  unit: DurationUnitEnum;
  tableData: TableData;
  sortBy: number;
  onChangeSortBy: (x: string) => void;
  title: string;
}


/*
 * Component
 */
const TimeTabs: FunctionComponent<Props> = (props) => {
  const { data, unit, tableData, sortBy, onChangeSortBy, title } = props;

  return (
    <Row center="xs">
      <Col xs={12}>
        <TabGroup titles={['Chart', 'Table']}>
          {
            data && (
              <StackedBarChart
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

