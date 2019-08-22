import styled from 'styled-components';
import { Fonts, ColoursEnum } from '../styles'


export const H1 = styled.h1`
  font-size: ${Fonts.size.heading1};
  font-family: ${Fonts.family.main};
  font-weight: ${Fonts.weight.regular};
  color: ${ColoursEnum.black};
`;

export const H2 = styled.h2`
  font-size: ${Fonts.size.heading2};
  font-family: ${Fonts.family.main};
  font-weight: ${Fonts.weight.regular};
  color: ${ColoursEnum.black};
`;

export const H3 = styled.h3`
  font-size: ${Fonts.size.heading3};
  font-family: ${Fonts.family.main};
  font-weight: ${Fonts.weight.regular};
  color: ${ColoursEnum.black};
`;

export const H4 = styled.h4`
  font-size: ${Fonts.size.heading4};
  font-family: ${Fonts.family.main};
  font-weight: ${Fonts.weight.regular};
  color: ${ColoursEnum.black};
`;

export const Text = styled.p`
  font-size: ${Fonts.size.body};
  font-family: ${Fonts.family.main};
  font-weight: ${Fonts.weight.regular};
  color: ${ColoursEnum.black};
`;

export const Span = styled.span`
  font-size: ${Fonts.size.body};
  font-family: ${Fonts.family.main};
  font-weight: ${Fonts.weight.regular};
  color: ${ColoursEnum.black};
`;

export const Special = styled.h1`
  font-size: ${Fonts.size.special};
  font-family: ${Fonts.family.special};
  font-weight: ${Fonts.weight.regular};
  color: ${ColoursEnum.black};
`;
