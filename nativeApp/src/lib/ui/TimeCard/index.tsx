import React, { FC } from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import CardWithButtons from '../CardWithButtons';

import { ColoursEnum } from '../colours';
import { FontsEnum } from '../typography';
import HoursAnMinutesText from '../HoursAndMinutesText';
import { DeleteButtonConfig } from '../CardWithButtons/types';


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
  paddingBottom: 6;
`;

/*
 * Component
 */
const TimeCard: FC<NavigationInjectedProps & Props> = (props) => {
  const {
    timeValues, date, labels, volunteer, navigation,
  } = props;

  const buttonConfig: DeleteButtonConfig = {
    buttonType: 'delete',
    onDelete: () => {},
    onEdit: () => { navigation.navigate('AdminEditTime'); },
  };
  return (
    <CardWithButtons buttonConfig={buttonConfig}>
      <HoursAnMinutesText align="left" timeValues={timeValues}>
        <MaterialCommunityIcons name="clock-outline" outline size={30} color={ColoursEnum.mustard} />
      </HoursAnMinutesText>
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

export default withNavigation(TimeCard);
