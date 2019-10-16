import styled from 'styled-components/native';
import { ColoursEnum } from './colours';

export const Heading = styled.Text`
  fontSize: 30;
  marginBottom: 20;
  `;

export const Heading2 = styled.Text`
  fontSize: 25;
  color: ${ColoursEnum.darkGrey}
  `;

export const Heading3 = styled.Text`
  fontSize: 20;
`;

export enum FontsEnum {
  light = 'roboto-light',
  regular = 'roboto-regular',
  medium = 'roboto-medium',
  bold = 'roboto-bold',
}
