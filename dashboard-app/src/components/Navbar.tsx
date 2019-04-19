import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';

import { ColoursEnum } from '../styles/style_guide';


const PaddedRow = styled(Row)`
  height: 4em;
  background-color: ${ColoursEnum.grey}
`;

const Title = styled.p`
  color: ${ColoursEnum.white}
  padding: 1em;
`;

const Navbar: React.SFC = (props) => (
  <PaddedRow middle="xs">
    <Col xs={3}>
      <Title>TWINE</Title>
    </Col>
  </PaddedRow>
);

export default Navbar;
