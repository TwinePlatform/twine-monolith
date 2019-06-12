import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col, Grid } from 'react-flexbox-grid';

import _Card from '../../Card';
import { H4 } from '../../Headings';
import { ColoursEnum, GraphColourList } from '../../../styles/design_system';
import LegendItem from './LegendItem';
import { isEveryDatumActive } from '../utils/util';
import { LegendData } from '../types';


/*
 * Types
 */

interface Props {
  title: string;
  legendData: LegendData;
  setLegendActivityOfAll: () => void;
  setLegendActivityOnUpdate: (id: number) => void;
}

/*
 * Styles
 */

const Card = styled(_Card)`
  background: ${ColoursEnum.white};
  height: 100%;
  padding: 1rem;
`;

const Title = styled(H4)`
  text-align: left;
  margin: 0;
`;

const TitleRow = styled(Row)`
  border-bottom: ${ColoursEnum.grey} 1px solid;
  margin-bottom: 0.5rem;
`;

/*
 * Components
 */

const Legend: FunctionComponent<Props> = (props) => {
  const { legendData, setLegendActivityOfAll, setLegendActivityOnUpdate, title } = props;

  return (
  <Col xs={3}>
    <Card>
      <Grid>
      <TitleRow middle="xs">
        <Col xs={6}>
          <Title>{title}</Title>
        </Col>
        <Col xs={3} xsOffset={3}>
          <LegendItem
            key="all"
            onClick={setLegendActivityOfAll}
            colour={ColoursEnum.darkGrey}
            title="All"
            active={isEveryDatumActive(legendData)}/>
        </Col>
      </TitleRow>
      {legendData.map((x, i) => (
        <LegendItem
          key={x.id}
          onClick={setLegendActivityOnUpdate(x.id)}
          colour={GraphColourList[i]}
          title={x.name}
          active={x.active}
        />))}
      </Grid>
    </Card>
  </Col >
  );
};

export default Legend;

