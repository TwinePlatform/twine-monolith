import React, { FC } from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card as C, Button as B } from 'native-base';

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
  marginBottom: 5;
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

const Label = styled.Text<{bold?: boolean; textAlign: string}>`
  textAlign: ${(props) => props.textAlign};
  color: ${ColoursEnum.darkGrey};
  fontFamily: ${(props) => (props.bold ? FontsEnum.medium : FontsEnum.light)}
  fontSize: 15;
  letterSpacing: 1.2;
  paddingBottom: 6;
`;

const ButtonContainer = styled.View`
  flexDirection: row;
`;
const Button = styled(B)`
  borderRadius: 0;
  flex: 1;
  flexDirection: row;
  alignItems: center;
  justifyContent: center;
`;
const LinkText = styled.Text`
  marginLeft: 2;
  textAlign: center;
  color: ${ColoursEnum.purple};
  fontSize: 15;
`;

const BorderRight = styled.View`
  flex: 1;
  borderRightWidth: 1;
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
  borderColor: ${ColoursEnum.grey};
`;
/*
 * Component
 */
const TimeCard: FC<Props> = (props) => {
  const {
    timeValues, date, labels, volunteer,
  } = props;
  return (
    <Card>
      <TopContainer>
        <ValueContainer>
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
      </TopContainer>

      <ButtonContainer>
        <Button transparent>
          <BorderRight>
            <MaterialCommunityIcons name="square-edit-outline" outline size={20} color={ColoursEnum.purple} />
            <LinkText>Edit</LinkText>
          </BorderRight>
        </Button>
        <Button transparent>
          <MaterialCommunityIcons name="trash-can-outline" outline size={20} color={ColoursEnum.purple} />
          <LinkText>Delete</LinkText>
        </Button>
      </ButtonContainer>
    </Card>

  );
};

export default TimeCard;
