import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';

import _Card from '../../Card';
import { H4 } from '../../Headings';
import { ColoursEnum, GraphColourList } from '../../../styles/design_system';
import LegendItem from './LegendItem';
import { AggregatedData } from '../../../dashboard/dataManipulation/logsToAggregatedData';
import { Dictionary } from 'ramda';


/*
 * Types
 */

interface Props {
  activeData: any[];
  setActiveDataPoint: (t: string) => void;
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
  border-bottom: ${ColoursEnum.grey} 1px solid;
`;

/*
 * Components
 */

const Legend: FunctionComponent<Props> = (props) => {
  const { activeData, setActiveDataPoint } = props;
  return (
  <Col xs={3}>
    <Card>
      <Title>Volunteers</Title> {/*TD*/}
      {activeData.map((x, i) => (
        <LegendItem
          key={x.key}
          setActiveDataPoint={setActiveDataPoint}
          colour={GraphColourList[i]}
          title={x.key}
          active={x.active}
        />))}
    </Card>
  </Col>
  );
};

export default Legend;

