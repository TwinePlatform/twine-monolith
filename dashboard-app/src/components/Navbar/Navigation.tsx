import React from 'react';
import styled from 'styled-components';
import { Row } from 'react-flexbox-grid';

import { ColoursEnum, SpacingEnum } from '../../styles/design_system';
import L from './Link';
import { CbAdmins } from '../../api';

interface Props {
  active: string;
}

interface LinkProps {
  isActive?: boolean;
}

const Link = styled(L)`
  padding: ${SpacingEnum.small};
  border-bottom: ${(props: LinkProps) => props.isActive
    ? `1.5px solid ${ColoursEnum.white}` : 'none'};
`;

const Navigation: React.FunctionComponent<Props> = (props) => (
  <Row between={'xs'}>
    {['activity', 'volunteer', 'time'].map((page) =>
      (<Link to={`./${page}`} key={page} isActive={page === props.active}>{page}</Link>)
    )}
      <Link to={'./login'} onClick={CbAdmins.logout}>Logout</Link>
    </Row>
);

export default Navigation;
