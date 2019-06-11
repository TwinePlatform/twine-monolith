import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col, Grid } from 'react-flexbox-grid';

import _Card from '../../Card';
import { H4 } from '../../Headings';
import { ColoursEnum, GraphColourList } from '../../../styles/design_system';
import LegendItem from './LegendItem';
import { LegendData } from '..';


/*
 * Types
 */

interface Props {
  title: string;
  activeLegendData: LegendData;
  setActiveLegendData: any;
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
 * Helpers
 */

export const isEveryDatumActive = (data: LegendData): boolean =>
  data.every((datum) => datum.active);

export const isEveryDatumInactive = (data: LegendData): boolean =>
  data.every((datum) => !datum.active);

export const flipActiveOfAll = (data: LegendData): LegendData => {
  const active: boolean = isEveryDatumActive(data)
    ? false
    : isEveryDatumInactive(data);

  return data.map((x) => ({ ...x, active }));
};

/*
 * Components
 */

const Legend: FunctionComponent<Props> = (props) => {
  const { activeLegendData, setActiveLegendData, title } = props;

  const updateLegendActivity = (id: number) => {
    return () => setActiveLegendData((prevState: LegendData): LegendData =>
      prevState.map((x) =>
        x.id === id
          ? {
            ...x,
            active: !x.active,
          }
        : x
      ));
  };

  const setActivityOfAll = () => {
    setActiveLegendData(flipActiveOfAll);
  };

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
            onClick={setActivityOfAll}
            colour={ColoursEnum.darkGrey}
            title="All"
            active={isEveryDatumActive(activeLegendData)}/>
        </Col>
      </TitleRow>
      {activeLegendData.map((x, i) => (
        <LegendItem
          key={x.id}
          onClick={updateLegendActivity(x.id)}
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

