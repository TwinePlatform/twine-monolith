import React, { FunctionComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';

import DataTable from '../components/DataTable';
import { TabGroup } from '../components/Tabs';
import { AggregatedData } from '../dataManipulation/logsToAggregatedData';
import { DurationUnitEnum } from '../../../types';
import { TableData } from '../dataManipulation/aggregatedToTableData';
import StackedBarChart from '../components/StackedBarChart/index';
import { LegendData } from '../components/StackedBarChart/types';


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
  legendData: LegendData;
  setLegendData: React.Dispatch<React.SetStateAction<LegendData>>;
}


/*
 * Component
 */
const TimeTabs: FunctionComponent<Props> = (props) => {
  const { data, unit, tableData, sortBy, onChangeSortBy, title, legendData, setLegendData } = props;

  return (
    <Row center="xs">
      <Col xs={12}>
        <TabGroup titles={['Chart', 'Table']}>
          {
            data && (
              <StackedBarChart
                legendData={legendData}
                setLegendData={setLegendData}
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

