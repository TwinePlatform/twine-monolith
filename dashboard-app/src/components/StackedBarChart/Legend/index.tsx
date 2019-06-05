import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';

import _Card from '../../Card';
import { H4 } from '../../Headings';
import { ColoursEnum, GraphColourList } from '../../../styles/design_system';
import LegendItem from './LegendItem';
import { ActiveData } from '..';


/*
 * Types
 */

interface Props {
  title: string;
  activeData: ActiveData;
  setActiveData: any;
}

/*
 * Styles
 */
const Card = styled(_Card)`
  margin-top: 4rem;
  background: ${ColoursEnum.white};
  height: 100%
`;

const Title = styled(H4)`
  text-align: left;
  padding: 1rem;
`;

const TitleRow = styled(Row)`
  border-bottom: ${ColoursEnum.grey} 1px solid;
`;
/*
 * Components
 */

const isEveryDatumActive = (data: ActiveData): boolean => data.every((datum) => datum.active);
const isEveryDatumInactive = (data: ActiveData): boolean => data.every((datum) => !datum.active);

const flipActiveOfAll = (data: ActiveData): ActiveData => {
  const active: boolean = isEveryDatumActive(data)
    ? false
    : isEveryDatumInactive(data);

  const newActiveData = data.map((x) => ({ ...x, active }));
  return newActiveData;
};

/*
 * Components
 */

const Legend: FunctionComponent<Props> = (props) => {
  const { activeData, setActiveData, title } = props;

  const setActivityOfDatum = (t: string) => {
    return () => setActiveData((prevState: ActiveData): ActiveData =>
      prevState.map((x) =>
        x.key === t
          ? {
            key: t,
            active: !x.active,
          }
        : x
      ));
  };

  const setActivityOfAll = () => {
    setActiveData(flipActiveOfAll);
  };

  return (
  <Col xs={3}>
    <Card>
      <TitleRow middle="xs" between="xs">
        <Col xs={3}>
          <Title>{title}</Title>
        </Col>
        <Col xs={6}>
          <LegendItem
            key="all"
            onClick={setActivityOfAll}
            colour={ColoursEnum.darkGrey}
            title="All"
            active={isEveryDatumActive(activeData)}/>
        </Col>
      </TitleRow>
      {activeData.map((x, i) => (
        <LegendItem
          key={x.key}
          onClick={setActivityOfDatum(x.key)}
          colour={GraphColourList[i]}
          title={x.key}
          active={x.active}
        />))}
    </Card>
  </Col>
  );
};

export default Legend;

