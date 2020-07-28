import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { TextInput } from "react-native";

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
  alignItems: flex-end;
  marginBottom: 5;
`;

const Value = styled.Text`
  color: ${ColoursEnum.darkGrey};
  fontSize: 25;
  font-family: ${FontsEnum.medium};
`;

const Unit = styled.Text`
  color: ${ColoursEnum.darkGrey};
  fontSize: 18;
  letterSpacing: 1.2;
  paddingBottom: 2;
`;

const Spacer = styled.View`
  width: 5;
`;

/*
 * Component
 */

// const minutes(startTime, endTime) = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
// const hours(startTime, endTime) = (endTime.getTime() - startTime.getTime()) / (1000 * 60));

export const HourAndMinutesText: FC<Props> = (props) => {

  const {
    timeValues, align,
  } = props;
  return (
    <Container align={align}>
      <Value>{timeValues[0]}</Value>
      <Spacer />
      <Unit>hours</Unit>
      <Spacer />
      <Value>{timeValues[1]}</Value>
      <Spacer />
      <Unit>minutes</Unit>
    </Container>
  );
};

// export default HourAndMinutesText;

export const TimeDiff: FC<Props> = (props) => {

  const {
    timeValues, align,
  } = props;

  const startTime = timeValues[0];
  const endTime = timeValues[1];

  const diffTime = startTime - endTime;
  const hours = Math.floor((endTime - startTime) / (1000 * 60 * 60));
  const minutes = Math.floor((endTime - startTime) / (1000 * 60) - hours * 60);

  return (
    <Container align={align}>
      <Value>{hours}</Value>
      <Spacer />
      <Unit>hours</Unit>
      <Spacer />
      <Value>{minutes}</Value>
      <Spacer />
      <Unit>minutes</Unit>
      {diffTime == 0 && <TextInput style={{ fontSize: 10, color: 'red' }}>*Please select different times. </TextInput>}
    </Container>


  );
};
