import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Fonts } from '../../styles/design_system'

export default styled(Link)`
  color: inherit;
  text-decoration: none;
  font-size: ${Fonts.size.body};
`;
