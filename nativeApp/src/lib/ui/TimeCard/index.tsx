import React, { FC } from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CardWithButtons from '../CardWithButtons';

import { ColoursEnum } from '../colours';
import { FontsEnum } from '../typography';

/*
 * Types
 */
type Props = {
  id: number;
  volunteer?: string;
  timeValues: [number, number];
  date: string;
  labels: [string, string];
}

/*
 * Styles
 */

const ValueContainer = styled.View`
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
  // marginRight: 10;
  color: ${ColoursEnum.darkGrey};
  fontSize: 18;
  letterSpacing: 1.2;
  paddingBottom: 6;
`;

const DetailsContainer = styled.View`
  flexDirection: row;
  alignItems: flex-end;
`;

const LabelContainer = styled.View`
  flexDirection: column;
  flex: 1;
`;

const Label = styled.Text<{bold?: boolean; textAlign: string}>`
  textAlign: ${(props) => props.textAlign};
  color: ${ColoursEnum.darkGrey};
  fontFamily: ${(props) => (props.bold ? FontsEnum.medium : FontsEnum.light)}
  fontSize: 15;
  letterSpacing: 1.2;
  paddingBottom: 6;
`;

/*
 * Component
 */
const TimeCard: FC<Props> = (props) => {
  const {
    timeValues, date, labels, volunteer,
  } = props;
  return (
    <CardWithButtons removalType="delete">
      <ValueContainer>
        <MaterialCommunityIcons name="clock-outline" outline size={35} color={ColoursEnum.mustard} />
        <Value>{timeValues[0]}</Value>
        <Unit>hours</Unit>
        <Value>{timeValues[1]}</Value>
        <Unit>minutes</Unit>
      </ValueContainer>
      <DetailsContainer>
        <LabelContainer>
          <Label textAlign="left">{date}</Label>
          {volunteer && <Label textAlign="left" bold>{volunteer}</Label>}
        </LabelContainer>
        <LabelContainer>
          <Label textAlign="right" bold>{labels[0]}</Label>
          <Label textAlign="right" bold>{labels[1]}</Label>
        </LabelContainer>
      </DetailsContainer>
    </CardWithButtons>
  );
};

export default TimeCard;
