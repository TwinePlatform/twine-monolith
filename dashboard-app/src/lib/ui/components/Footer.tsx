import React from 'react';
import styled from 'styled-components';
import { Grid, Row as _Row, Col } from 'react-flexbox-grid';
import { Span } from './Typography';
import { ReactComponent as _Logo } from '../../../assets/logo_image.svg';


const FooterContainer = styled(Grid)`
  height: 13rem;
`;

const Row = styled(_Row)`
  height: 33%
`;

const Logo = styled(_Logo)`
  height: 3rem;
`;

const Footer: React.FunctionComponent<{}> = () => (
  <FooterContainer>
    <Row/>
    <Row center="xs">
      <Logo/>
    </Row>
    <Row center="xs">
      <Col xs={4}>
        <footer>
          <Span>&copy; TWINE 2019</Span>
        </footer>
      </Col>
    </Row>
  </FooterContainer>
);

export default Footer;
