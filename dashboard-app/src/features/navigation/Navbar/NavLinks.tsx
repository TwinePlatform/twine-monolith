import React from 'react';
import styled from 'styled-components';
import { Row } from 'react-flexbox-grid';

import { ColoursEnum } from '../../../lib/ui/design_system';
import { CbAdmins } from '../../../lib/api';
import L from './Link';


interface Props {
  links: {
    to: string,
    content: string,
    active?: boolean,
  }[];
  withLogout?: boolean;
}

interface LinkProps {
  isActive?: boolean;
}

const Link = styled(L)`
  padding: 0.5rem;
  border-bottom: ${(props: LinkProps) => props.isActive
    ? `1.5px solid ${ColoursEnum.white}` : 'none'};
`;

const NavLinks: React.FunctionComponent<Props> = ({ links, withLogout }) => (
  <Row between="xs" middle="xs">
    {
      links.map((link) => (
        <Link to={link.to} key={link.to} isActive={link.active}>
          {link.content}
        </Link>
      ))
    }
    {
      withLogout && <Link to={'./login'} onClick={CbAdmins.logout}>Logout</Link>
    }
  </Row>
);

export default NavLinks;
