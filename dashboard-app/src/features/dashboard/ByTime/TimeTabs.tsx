import React, { FunctionComponent } from 'react';
import { Row, Col } from 'react-flexbox-grid';

import DataTable from '../components/DataTable';
import { TabGroup } from '../components/Tabs';
import { AggregatedData } from '../dataManipulation/logsToAggregatedData';
import { DurationUnitEnum } from '../../../types';
import { TableData } from '../dataManipulation/aggregatedToTableData';
import StackedBarChart from '../components/StackedBarChart/index';
import { LegendData } from '../components/StackedBarChart/types';
import { TitleString } from '../components/Title';
import { Order } from 'twine-util/arrays';
import { Orderable } from '../hooks/useOrderable';


/*
 * Types
 */
interface Props {
  data?: AggregatedData;
  unit: DurationUnitEnum;
  tableData: TableData;
  orderable: Orderable;
  onChangeSortBy: (x: string) => void;
  title: TitleString;
  legendData: LegendData;
  setLegendData: React.Dispatch<React.SetStateAction<LegendData>>;
}


/*
 * Component
 */
const TimeTabs: FunctionComponent<Props> = (props) => {
  const { data, unit, tableData, onChangeSortBy, title, legendData, setLegendData, orderable } = props;

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
  );
};

export default TimeTabs;

