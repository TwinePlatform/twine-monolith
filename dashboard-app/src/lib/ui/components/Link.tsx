import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ColoursEnum, Fonts } from '../design_system';

export default styled(Link)`
  color: ${ColoursEnum.black};
  text-decoration: underline;
  font-size: ${Fonts.size.body};
`;
