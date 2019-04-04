import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { colors, fonts } from '../styles/style_guide';


export default styled(Link)`
  font-weight: ${fonts.weight.medium};
  color: ${colors.dark};
  text-decoration: none;
`;
