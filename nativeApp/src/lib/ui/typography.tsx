import styled from 'styled-components/native';
import { Text as T } from 'native-base';
import { ColoursEnum } from './colours';

export const Heading = styled.Text`
  letterSpacing: 1.2;
  fontSize: 30;
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
  nunito = 'nunito-regular',
}

export const ErrorText = styled(T)`
  marginBottom: 5;
  color: ${ColoursEnum.red}
`;
