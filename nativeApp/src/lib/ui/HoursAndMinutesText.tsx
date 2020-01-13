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
const HourAndMinutesText: FC<Props> = (props) => {
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

export default HourAndMinutesText;
