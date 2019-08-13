import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';

import { ReactComponent as _TextLogo } from '../../../assets/logo_text.svg';
import { ColoursEnum, Fonts, MediaQueriesEnum } from '../../../lib/ui/design_system';
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
  height: 4rem;
  background-color: ${ColoursEnum.darkGrey};
  color: ${ColoursEnum.white};
  font-weight: ${Fonts.weight.regular};
  padding: 0 1.75rem;
  margin-bottom: 6rem;

  ${MediaQueriesEnum.standardDesktop}{
    margin-bottom: 4rem;
}
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

  return (
    <PaddedRow middle="xs" between="xs">
      <Col xs={5} md={7} lg={8}>
        <TextLogo/>
      </Col>
      <Col xs={7} md={5} lg={4}>
        { isLoggedIn && <NavLinks links={links} withLogout={isLoggedIn}/> }
      </Col>
    </PaddedRow>
  );
};

export default Navbar;
