import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontSizeEnum } from '../styles/style_guide';


export default styled(Link)`
  color: inherit;
  text-decoration: none;
  font-size: ${FontSizeEnum.normal};
`;
