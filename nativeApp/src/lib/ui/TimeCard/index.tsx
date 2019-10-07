
import React, { FC } from 'react';
import styled from 'styled-components/native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card as C } from 'native-base'

import { ColoursEnum } from '../colours';
import { FontsEnum } from '../typography';

/*
 * Types
 */
type Props = {
  id: number;
  timeValues:  [number, number];
  date: string;
  labels: [string, string];
}

/*
 * Styles
 */
const Card = styled(C)`
  width: 85%;
  marginBottom: 10;

`;

const TopContainer = styled.View`
  marginLeft: 10;
  marginTop: 10;
  marginRight: 10;
  paddingBottom: 5;
  borderBottomWidth: 1;
  borderColor: ${ColoursEnum.grey};
`;

const ValueContainer = styled.View`
  width: 100%;
  flexDirection: row;
  alignItems: flex-end;
`;

const Value = styled.Text`
  color: ${ColoursEnum.darkPurple};
  fontSize: 35;
  font-family: ${FontsEnum.medium}
`;

const Unit = styled.Text`
  marginLeft: 5;
  marginRight: 10;
  color: ${ColoursEnum.darkPurple};
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

const Date = styled.Text`
  flex: 1;
  color: ${ColoursEnum.darkGrey};
  fontSize: 15;
  letterSpacing: 1.2;
  paddingBottom: 6;
`;

const Label = styled.Text`
  textAlign: right;
  color: ${ColoursEnum.darkGrey};
  fontFamily: ${FontsEnum.medium}
  fontSize: 15;
  letterSpacing: 1.2;
  paddingBottom: 6;
`;

const ButtonContainer = styled.View`
  flexDirection: row;
  marginTop: 10;
  marginBottom: 10;
`
const Button = styled.View<{first?: boolean}>`
  ${(props)=> props.first && `
    borderRightWidth: 1;
    borderColor: ${ColoursEnum.grey}
  `}
  flex: 1;
  flexDirection: row;
  alignItems: center;
  justifyContent: center;
`;
const Link = styled.Text`
  marginLeft: 2;
  textAlign: center;
  color: ${ColoursEnum.purple};
  fontSize: 15;
`;

/*
 * Component
 */
const TimeCard: FC<Props> = (props) => {
  return (
    <Card style={{width: '85%'}}>
      <TopContainer>
        <ValueContainer>
          <Value>{props.timeValues[0]}</Value>
          <Unit>hours</Unit>
          <Value>{props.timeValues[1]}</Value>
          <Unit>minutes</Unit>
        </ValueContainer>
        <DetailsContainer>
          <Date>{props.date}</Date>
          <LabelContainer>
            <Label>{props.labels[0]}</Label>
            <Label>{props.labels[1]}</Label>
          </LabelContainer>
        </DetailsContainer>
      </TopContainer>

      <ButtonContainer>
        <Button first={true}>
          <MaterialCommunityIcons name="square-edit-outline" outline size={20} color={ColoursEnum.purple}/>
          <Link>Edit</Link>
        </Button>
        <Button>
          <MaterialCommunityIcons name="trash-can-outline" outline size={20} color={ColoursEnum.purple}/>
          <Link>Delete</Link>
        </Button>
      </ButtonContainer>
    </Card>

  );
};

export default TimeCard;

