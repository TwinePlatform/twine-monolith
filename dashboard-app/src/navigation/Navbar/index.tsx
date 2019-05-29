import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';

import { ReactComponent as _TextLogo } from '../../components/assets/logo_text.svg';
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

const TextLogo = styled(_TextLogo)`
  height: 1.75rem;
`;


/**
 * Component
 */
const Navbar: React.FunctionComponent<Props> = (props) => {
  const currentPage = Pages.matchPath(props.pathname);
  const isLoggedIn = currentPage ? currentPage.protected : false;
  const links = Pages.getNavbarLinks().map((page) => ({
    to: page.url,
    content: page.title,
    active: page.url === (currentPage || { url: '' }).url,
  }));

  return(
  <PaddedRow middle="xs" between="xs">
    <Col xs={6} md={8} lg={9}>
      <TextLogo/>
    </Col>
    <Col xs={6} md={4} lg={3}>
      { isLoggedIn && <NavLinks links={links} withLogout={isLoggedIn}/> }
    </Col>
  </PaddedRow>
  );
};

export default Navbar;
