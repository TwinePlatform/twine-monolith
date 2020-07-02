import React, { FC } from 'react';
import styled from 'styled-components/native';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import L from './Line';
import { ColoursEnum } from './colours';

/*
 * Types
 */
type Props = {
  title: string;
}

/*
 * Styles
 */

const Line = styled(L)`
  width: 100%;
`;

const Text = styled.Text`
  fontSize: 15;
  marginLeft: 5;
  color: ${ColoursEnum.darkGrey};
`;
const View = styled.View`
  width: 85%;
  marginVertical: 5;
  marginBottom: 5;
`;
const WordContainer = styled.View`
  flexDirection: row;
  justifyContent: flex-start;
  marginBottom: 5;
`;
/*
 * Component
 */

const CardSeparator: FC<Props> = ({ title }) => (
  <View>
    <WordContainer>
      <MaterialCommunityIcons name="clock-outline" outline size={15} color={ColoursEnum.mustard} />
      <Text>{title}</Text>
    </WordContainer>
    <Line />
  </View>
);
export default CardSeparator;
