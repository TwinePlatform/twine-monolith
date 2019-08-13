import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import { ChartData } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as chartjs from 'chart.js';

import RoundedBar from './RoundedBar';
import { getStackedGraphOptions, totalizer } from './utils/chartjsUtils';
import _Card from '../../../../lib/ui/components/Card';
import { ColoursEnum, MediaQueriesEnum } from '../../../../lib/ui/design_system';
import { TitleString, Title } from '../Title';
import { Paragraph } from '../../../../lib/ui/components/Typography';


/*
 * Types
 */
interface Props {
  data: ChartData<chartjs.ChartData>;
  xAxisTitle: string;
  yAxisTitle: string;
  title: TitleString;
  noActiveLegendText: string;
  isAllLegendDataInactive: boolean;
  tooltipUnit: string;
}


/*
 * Styles
 */
const Card = styled(_Card)`
  background: ${ColoursEnum.white};
  height: 100%;
`;

const GraphContentContainer = styled.div`
  position: relative;
`;

const HideableTextOverlay = styled.div<{ isVisible: boolean }>`
  position: absolute;
  background-color: white;
  opacity: ${(props) => props.isVisible ? 1 : 0};
  transition: opacity 0.2s linear;
  display: block;
  height: 100%;
  width: 100%;
  padding: 10rem 0;

  ${MediaQueriesEnum.landscapeTablet} {
    padding: 8rem 0;
  };
`;

const TransitionText = styled(Paragraph)<{ isVisible: boolean }>`
  opacity: ${(props) => props.isVisible ? 1 : 0};
  transition: opacity 0.1s linear;
  transition-delay: 0.1s;
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

  const isVisible = checkIsDataEmpty(data) || isAllLegendDataInactive;

  return (
    <Card>
      <Title title={title}/>
      <Row center="xs" middle="xs">
        <Col xs={12} md={9}>
          <GraphContentContainer>
            <HideableTextOverlay isVisible={isVisible}>
              <TransitionText isVisible={isVisible}>{noActiveLegendText}</TransitionText >
            </HideableTextOverlay>
            <RoundedBar
              datasetKeyProvider={datasetKeyProvider}
              plugins={[totalizer, ChartDataLabels]}
              data={data}
              options={getStackedGraphOptions(xAxisTitle, yAxisTitle, tooltipUnit)}
            />
          </GraphContentContainer>
        </Col>
      </Row>
    </Card>
  );
};

export default Chart;

