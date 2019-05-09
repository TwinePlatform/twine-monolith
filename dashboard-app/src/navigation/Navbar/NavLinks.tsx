import React from 'react';
import styled from 'styled-components';
import { Row } from 'react-flexbox-grid';

import { ColoursEnum } from '../../styles/design_system';
import L from './Link';
import { CbAdmins } from '../../api';

interface Props {
  active: string;
  links: {
    to: string,
    active
  }[];
}

interface LinkProps {
  isActive?: boolean;
}

const Link = styled(L)`
  padding: 0.5rem;
  border-bottom: ${(props: LinkProps) => props.isActive
    ? `1.5px solid ${ColoursEnum.white}` : 'none'};
`;

const NavLinks: React.FunctionComponent<Props> = (props) => (
  <Row between="xs" middle="xs">
    {['activity', 'volunteer', 'time'].map((page) =>
      (<Link to={`./${page}`} key={page} isActive={page === props.active}>{page}</Link>)
    )}
      <Link to={'./login'} onClick={CbAdmins.logout}>Logout</Link>
    </Row>
);

export default NavLinks;
