import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';

import { ColoursEnum, FontSizeEnum, FontWeightEnum } from '../../styles/style_guide';
import Navigation from './Navigation';


interface Props {
  loggedIn: boolean;
  active: string | false;
}

const PaddedRow = styled(Row)`
  height: 4em;
  background-color: ${ColoursEnum.grey}
  color: ${ColoursEnum.white}
  font-weight: ${FontWeightEnum.light}
  padding: 0 1.5em;
`;

const Title = styled.p`
  font-size: ${FontSizeEnum.heading};
`;

const Navbar: React.FunctionComponent<Props> = (props) => (
  <PaddedRow middle="xs" between="xs">
    <Col xs={6} lg={4}>
      <Title>TWINE</Title>
    </Col>
    <Col xs={6} lg={4}>
    {props.loggedIn &&
      <Navigation {...props}/>
    }
    </Col>
  </PaddedRow>
);

export default Navbar;
