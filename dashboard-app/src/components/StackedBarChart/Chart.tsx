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
import { FullWidthTextBox } from '../FullWidthTextBox';


/*
 * Types
 */
interface Props {
  data: ChartData<chartjs.ChartData>;
  xAxisTitle: string;
  yAxisTitle: string;
  title: string;
  noActiveLegendText: string;
  isAllLegendDataInactive: boolean;
  tooltipUnit: string;
}

type HidableTextBoxProp = {
  isVisible: boolean;
};

/*
 * Styles
 */
const Card = styled(_Card)`
  background: ${ColoursEnum.white};
  height: 100%;
  padding: 1rem;
`;

const Title = styled(H3)`
  text-align: left;
`;

const HidableTextBox = styled(FullWidthTextBox)<HidableTextBoxProp>`
  visibility: ${({ isVisible }) => isVisible ? 'inherit' : 'hidden'};
`;

/*
 * Helpers
 */
const datasetKeyProvider = (d: { id: number }) => d.id;
const checkIsDataEmpty = (cd: any) => (!cd || cd.datasets.length === 0);


/*
 * Components
 */

const Chart: FunctionComponent<Props> = (props) => {
  const {
    data,
    xAxisTitle,
    yAxisTitle,
    title,
    isAllLegendDataInactive,
    noActiveLegendText,
    tooltipUnit,
  } = props;

  const graph = (
    <RoundedBar
      datasetKeyProvider={datasetKeyProvider}
      plugins={[totalizer, ChartDataLabels]}
      data={data}
      options={getStackedGraphOptions(xAxisTitle, yAxisTitle, tooltipUnit)}
    />
  );

  return (
    <Card>
      <Row center="xs">
        <Col xs={12}>
          <Title>{title}</Title>
        </Col>
      </Row>
      <Row center="xs" middle="xs">
        <Col xs={12} md={9}>
        <HidableTextBox
          height="2rem"
          isVisible={isAllLegendDataInactive}
          text ={noActiveLegendText}
        />
          {
            checkIsDataEmpty(data)
              ? <FullWidthTextBox text ="NO DATA AVAILABLE"/>
              : graph
          }
        </Col>
      </Row>
    </Card>
  );
};

export default Chart;

