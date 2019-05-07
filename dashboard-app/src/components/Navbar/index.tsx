import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';

import { ColoursEnum, Fonts } from '../../styles/design_system';
import Navigation from './Navigation';
import { Dictionary } from 'ramda';


interface Props {
  pathname: string;
}


const PaddedRow = styled(Row)`
  height: 4em;
  background-color: ${ColoursEnum.grey};
  color: ${ColoursEnum.white};
  font-weight: ${Fonts.weight.regular};
  padding: 0 1.5em;
`;

const Title = styled.p`
  font-size: ${Fonts.size.heading1};
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
  const isLoggedIn = Boolean(pageFromRoute(props.pathname));
  const active = pageFromRoute(props.pathname);

  return(
  <PaddedRow middle="xs" between="xs">
    <Col xs={6} lg={4}>
      <Title>TWINE</Title>
    </Col>
    <Col xs={6} lg={4}>
    {isLoggedIn &&
      <Navigation active={active}/>
    }
    </Col>
  </PaddedRow>
  );
};

export default Navbar;
