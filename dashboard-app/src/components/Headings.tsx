import styled from 'styled-components';
import { fonts, colors } from '../styles/style_guide';

export const H1 = styled.h1`
  font-size: ${fonts.size.heading};
  font-weight: ${fonts.weight.light};
  color: ${colors.dark};
  text-align: center;
`;

export const H2 = styled.h2`
  font-size: ${fonts.size.heading2};
  font-weight: ${fonts.weight.light};
  color: ${colors.dark};
  text-align: center;
`;

export const H3 = styled.h3`
  font-weight: ${fonts.weight.light};
  color: ${colors.dark};
  text-align: center;
`;

export const H4 = styled.h4`
  font-weight: ${fonts.weight.light};
  color: ${colors.dark};
  text-align: center;
`;

export default H1;
