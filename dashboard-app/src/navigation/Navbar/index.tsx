import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';

import { ColoursEnum, Fonts } from '../../styles/design_system';
import NavLinks from './NavLinks';
import { Pages } from '../pages';


/**
 * Types
 */
interface Props {
  pathname: string;
}


/**
 * Styles
 */
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


/**
 * Component
 */
const Navbar: React.FunctionComponent<Props> = (props) => {
  const currentPage = Pages.matchPath(props.pathname);
  const isLoggedIn = currentPage.protected;
  const links = Pages.getProtected().map((page) => ({
    to: page.url,
    content: page.title,
    active: page.url === currentPage.url,
  }));

  return(
  <PaddedRow middle="xs" between="xs">
    <Col xs={6} lg={4}>
      <Title>TWINE</Title>
    </Col>
    <Col xs={6} lg={4}>
      { isLoggedIn && <NavLinks links={links} withLogout={isLoggedIn}/> }
    </Col>
  </PaddedRow>
  );
};

export default Navbar;
