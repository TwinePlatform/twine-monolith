import styled from 'styled-components';
import { ColoursEnum, Fonts, FontWeightEnum } from '../design_system';

export const Paragraph = styled.p`
  font-size: ${Fonts.size.body};
  color: ${ColoursEnum.black};
`;

export const Span = styled.span`
  font-size: ${Fonts.size.body};
  color: ${ColoursEnum.black};
`;

export const Bold = styled(Span)`
  font-weight: ${FontWeightEnum.heavy};
`;
