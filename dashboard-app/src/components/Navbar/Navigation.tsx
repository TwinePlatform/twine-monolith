import React from 'react';
import styled from 'styled-components';
import { Row } from 'react-flexbox-grid';

import { ColoursEnum, SpacingEnum } from '../../styles/style_guide';
import L from '../Link';
import { CbAdmins } from '../../api';
import { Button } from '../Buttons';


interface Props {
  loggedIn: boolean;
  active: string | false;
}

interface LinkProps {
  active?: boolean;
}

const Link = styled(L)`
  padding: ${SpacingEnum.xxSmall};
  border-bottom: ${(props: LinkProps) => props.active
    ? `1.5px solid ${ColoursEnum.white}` : 'none'};
`;

const Logout = styled(Button)`
  background-color: transparent;
  font-size: inherit;
  display: inherit;
  font-weight: inherit;
`;

const Navigation: React.FunctionComponent<Props> = (props) => (

  <Row between={'xs'}>
      <Link to={'./activites'}>Activity</Link>
      <Link to={'./volunteer'}>Volunteer</Link>
      <Link to={'./time'} active>Time</Link>
      <Link to={'./time'}>[ User ]</Link>
      <Logout onClick={CbAdmins.logout}>Logout</Logout>
    </Row>
);

export default Navigation;
