import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import { Bar, ChartData } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as chartjs from 'chart.js';


import _DataTable from '../DataTable';
import { getStackedGraphOptions, totalizer } from './util';
import _Card from '../Card';
import { H3 } from '../Headings';
import { ColoursEnum } from '../../styles/design_system';
import { aggregatedToStackedGraph } from '../../dashboard/dataManipulation/aggregatedToGraphData';


/*
 * Types
 */

interface Props {
  data: ChartData<chartjs.ChartData>;
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
  background: ${ColoursEnum.white};
  height: 100%;
`;
const Title = styled(H3)`
  text-align: left;
`;

/*
 * Components
 */

const Chart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title } = props;
  return (
  <Col xs={9}>
    <Card>
      <Row center="xs">
        <Col xs={12}>
          <Title>{title}</Title>
        </Col>
      </Row>
      <Row center="xs" middle="xs">
        <Col xs={12} md={9}>
        <Bar
          plugins={[totalizer, ChartDataLabels]}
          data={data}
          options={getStackedGraphOptions(xAxisTitle, yAxisTitle)}
        />
        </Col>
      </Row>
    </Card>
  </Col>);
};

export default Chart;

