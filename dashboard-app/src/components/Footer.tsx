import React from 'react';
import styled from 'styled-components';
import { Grid, Row as _Row, Col } from 'react-flexbox-grid';
import { Span } from './Typography';


const FooterContainer = styled(Grid)`
  height: 13rem;
`;

const Row = styled(_Row)`
  height: 100%;
`;

const Footer: React.FunctionComponent<{}> = () => (
  <FooterContainer>
    <Row center="xs" middle="xs">
      <Col xs={4}>
        <Span>&copy; TWINE 2019</Span>
      </Col>
    </Row>
  </FooterContainer>
);

export default Footer;
