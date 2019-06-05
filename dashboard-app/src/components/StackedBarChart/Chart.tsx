import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import { ChartData } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as chartjs from 'chart.js';

import RoundedBar from './RoundedBar';
import { getStackedGraphOptions, totalizer } from './utils/chartjsUtils';
import _Card from '../Card';
import { H3 } from '../Headings';
import { ColoursEnum } from '../../styles/design_system';


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

const MainCol = styled(Col)`
  padding: 0 !important;
`;

const Card = styled(_Card)`
  background: ${ColoursEnum.white};
  height: 100%;
  padding: 1rem;
`;

const Title = styled(H3)`
  text-align: left;
`;

/*
 * Components
 */

const Chart: FunctionComponent<Props> = (props) => {
  const { data, xAxisTitle, yAxisTitle, title } = props;
  const datasetKeyProvider = (d: any) => d.id;
  return (
  <MainCol xs={9}>
    <Card>
      <Row center="xs">
        <Col xs={12}>
          <Title>{title}</Title>
        </Col>
      </Row>
      <Row center="xs" middle="xs">
        <Col xs={12} md={9}>
        <RoundedBar
          datasetKeyProvider={datasetKeyProvider}
          plugins={[totalizer, ChartDataLabels]}
          data={data}
          options={getStackedGraphOptions(xAxisTitle, yAxisTitle)}
        />
        </Col>
      </Row>
    </Card>
  </MainCol>);
};

export default Chart;

