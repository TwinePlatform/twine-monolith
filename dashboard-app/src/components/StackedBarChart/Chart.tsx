import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';


import _DataTable from '../DataTable';
import { getStackedGraphOptions, totalizer } from './util';
import _Card from '../Card';
import { H3 } from '../Headings';
import { ColoursEnum } from '../../styles/design_system';
import { DurationUnitEnum } from '../../types';
import { AggregatedData } from '../../dashboard/dataManipulation/logsToAggregatedData';
import { aggregatedToStackedGraph } from '../../dashboard/dataManipulation/aggregatedToGraphData';


/*
 * Types
 */

interface Props {
  data: AggregatedData;
  unit: DurationUnitEnum;
  xAxisTitle: string;
  yAxisTitle: string;
  title: string;
}
/*
 * Styles
 */
const Card = styled(_Card)`
  margin-top: 4rem;
  padding: 1rem;
  background: ${ColoursEnum.white}
`;
const Title = styled(H3)`
  text-align: left;
`;

/*
 * Components
 */

const Chart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title, unit } = props;
  return (
  <Col xs={9}>
    <Card>
      <Row center="xs">
        <Col xs={12}>
          <Title>{title}</Title>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={12} md={9}>
        <Bar
          plugins={[totalizer, ChartDataLabels]}
          data={aggregatedToStackedGraph(data, unit)}
          options={getStackedGraphOptions(xAxisTitle, yAxisTitle)}
        />
        </Col>
      </Row>
    </Card>
  </Col>);
};

export default Chart;

