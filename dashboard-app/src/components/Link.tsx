import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ColoursEnum } from '../styles/style_guide';


export default styled(Link)`
  color: ${ColoursEnum.font};
  text-decoration: none;
`;
