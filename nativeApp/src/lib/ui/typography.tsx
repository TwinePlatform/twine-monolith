import styled from 'styled-components/native';
import { ColoursEnum } from './colours';

export const Heading = styled.Text`
  letterSpacing: 1.2;
  fontSize: 30;
  marginBottom: 20;
  `;

export const Heading2 = styled.Text`
  letterSpacing: 1.2;
  fontSize: 25;
  color: ${ColoursEnum.darkGrey}
  `;

export const Heading3 = styled.Text`
  letterSpacing: 1.2;
  fontSize: 20;
`;

export enum FontsEnum {
  light = 'roboto-light',
  regular = 'roboto-regular',
  medium = 'roboto-medium',
  bold = 'roboto-bold',
}
