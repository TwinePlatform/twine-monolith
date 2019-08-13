import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';

import _DataTable from '../components/DataTable';
import { TabGroup } from '../components/Tabs';
import { AggregatedData } from '../dataManipulation/logsToAggregatedData';
import { DurationUnitEnum } from '../../../types';
import { TableData } from '../dataManipulation/aggregatedToTableData';
import StackedBarChart from '../components/StackedBarChart/index';
import { LegendData } from '../components/StackedBarChart/types';
import { TitleString } from '../components/Title';
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
 * Styles
 */
const DataTable = styled(_DataTable)`
  margin-top: 4rem;
`;


/*
 * Component
 */
const VolunteerTabs: FunctionComponent<Props> = (props) => {
  const {
    data,
    unit,
    tableData,
    onChangeSortBy,
    title,
    legendData,
    setLegendData,
    orderable,
  } = props;

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
                sortBy={tableData.headers[orderable.sortByIndex]}
                order={orderable.order}
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
