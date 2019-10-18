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

const Container = styled.View<Pick<Props, 'align'>>`
  justifyContent: ${({ align }) => (align === 'center' ? 'center' : 'flex-start')};
  width: 100%;
  flexDirection: row;
  alignItems: center;
  marginBottom: 5;
`;

const ValuesContainer = styled.View`
  flexDirection: row;
  justifyContent: center;
  alignItems: flex-end;
`;

const Value = styled.Text`
  marginLeft: 5;
  color: ${ColoursEnum.darkGrey};
  fontSize: 30;
  font-family: ${FontsEnum.medium};
`;

const Unit = styled.Text`
  marginLeft: 5;
  color: ${ColoursEnum.darkGrey};
  fontSize: 18;
  letterSpacing: 1.2;
  paddingBottom: 3;
`;

/*
 * Component
 */
const HourAndMinutesText: FC<Props> = (props) => {
  const {
    timeValues, children: icon, align,
  } = props;
  return (
    <Container align={align}>
      <ValuesContainer>
        {icon}
        <Value>{timeValues[0]}</Value>
        <Unit>hours</Unit>
        <Value>{timeValues[1]}</Value>
        <Unit>minutes</Unit>
      </ValuesContainer>
    </Container>
  );
};

export default HourAndMinutesText;
