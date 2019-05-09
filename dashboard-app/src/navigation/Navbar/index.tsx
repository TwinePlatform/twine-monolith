import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import { Dictionary } from 'ramda';

import { ColoursEnum, Fonts } from '../../styles/design_system';
import NavLinks from './NavLinks';
import { Pages } from '../pages';


interface Props {
  pathname: string;
}


const PaddedRow = styled(Row)`
  height: 4.8125rem;
  background-color: ${ColoursEnum.darkGrey};
  color: ${ColoursEnum.white};
  font-weight: ${Fonts.weight.regular};
  padding: 0 1.75rem;
  margin-bottom: 6rem;
`;

const Title = styled.p`
  font-size: ${Fonts.size.heading2};
  font-weight: 300;
  letter-spacing: 0.2rem;
`;


const pageFromRoute = (url: string): string => {
  const routes: Dictionary<string> = {
    '/activity': 'activity',
    '/time': 'time',
    '/volunteer': 'volunteer',
    '/': '/',
  };

  return routes[url];
};

const Navbar: React.FunctionComponent<Props> = (props) => {
  const page = Pages.matchPath(props.pathname);
  const isLoggedIn = Boolean(pageFromRoute(props.pathname));
  const active = pageFromRoute(props.pathname);

  return(
  <PaddedRow middle="xs" between="xs">
    <Col xs={6} lg={4}>
      <Title>TWINE</Title>
    </Col>
    <Col xs={6} lg={4}>
    { page && <NavLinks active={active}/> }
    </Col>
  </PaddedRow>
  );
};

export default Navbar;
