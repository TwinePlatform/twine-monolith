import styled from 'styled-components';
import { ColoursEnum, FontSizeEnum, FontWeightEnum } from '../styles/style_guide';

export const H1 = styled.h1`
  font-size: ${FontSizeEnum.heading};
  font-weight: ${FontWeightEnum.light};
  color: ${ColoursEnum.font};
  text-align: center;
`;

export const H2 = styled.h2`
  font-size: ${FontSizeEnum.heading2};
  font-weight: ${FontWeightEnum.light};
  color: ${ColoursEnum.font};
  text-align: center;
`;

export const H3 = styled.h3`
  color: ${ColoursEnum.font};
  text-align: center;
`;

export const H4 = styled.h4`
  color: ${ColoursEnum.font};
  text-align: center;
`;

export default H1;
