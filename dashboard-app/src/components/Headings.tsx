import styled from 'styled-components';
import { SpacingEnum, ColoursEnum, Fonts } from '../styles/design_system';


export const H1 = styled.h1`
  font-size: ${Fonts.size.heading1};
  font-weight: ${Fonts.weight.regular};
  color: ${ColoursEnum.black};
  text-align: center;
  margin-top: ${SpacingEnum.small};
`;

export const H2 = styled.h2`
  font-size: ${Fonts.size.heading2};
  font-weight: ${Fonts.weight.regular};
  color: ${ColoursEnum.black};
  text-align: center;
`;

export const H3 = styled.h3`
  font-size: ${Fonts.size.heading3};
  color: ${ColoursEnum.black};
  text-align: center;
`;

export const H4 = styled.h4`
  font-size: ${Fonts.size.heading4};
  color: ${ColoursEnum.black};
  text-align: center;
`;

export default H1;
