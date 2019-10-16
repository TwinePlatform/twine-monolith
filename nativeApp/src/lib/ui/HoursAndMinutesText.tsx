import React, { FC } from 'react';
import styled from 'styled-components/native';

import { ColoursEnum } from './colours';
import { FontsEnum } from './typography';

/*
 * Types
 */
type Props = {
  timeValues: [number, number];
  align: 'center' | 'left';
}

/*
 * Styles
 */

const ValueContainer = styled.View<Pick<Props, 'align'>>`
  justifyContent: ${({ align }) => (align === 'center' ? 'center' : 'flex-start')};
  width: 100%;
  flexDirection: row;
  alignItems: flex-end;
  marginBottom: 5;
`;

const Value = styled.Text`
  marginLeft: 5;
  color: ${ColoursEnum.darkGrey};
  fontSize: 35;
  font-family: ${FontsEnum.medium}
`;

const Unit = styled.Text`
  marginLeft: 5;
  color: ${ColoursEnum.darkGrey};
  fontSize: 18;
  letterSpacing: 1.2;
  paddingBottom: 6;
`;

/*
 * Component
 */
const HourAndMinutesText: FC<Props> = (props) => {
  const {
    timeValues, children: icon, align,
  } = props;
  return (
    <ValueContainer align={align}>
      {icon}
      <Value>{timeValues[0]}</Value>
      <Unit>hours</Unit>
      <Value>{timeValues[1]}</Value>
      <Unit>minutes</Unit>
    </ValueContainer>
  );
};

export default HourAndMinutesText;
