import React, { FC } from 'react';
import styled from 'styled-components/native';

import { MaterialIcons } from '@expo/vector-icons';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { ColoursEnum } from '../../../../lib/ui/colours';
import CardWithButtons from '../../../../lib/ui/CardWithButtons';
import { Heading2 as H2 } from '../../../../lib/ui/typography';
import { DeleteButtonConfig } from '../../../../lib/ui/CardWithButtons/types';

/*
 * Types
 */
type Props = {
  id: number;
  title: string;
  date: string;
}

/*
 * Styles
 */
const Heading2 = styled(H2)`
  marginLeft: 5;
`;

const HeadingContainer = styled.View`
  width: 100%;
  flexDirection: row;
  alignItems: flex-end;
  marginBottom: 5;
`;

const Description = styled.Text`
  color: ${ColoursEnum.darkGrey};
  fontSize: 15;
  paddingBottom: 5;
  marginLeft: 4;
`;

/*
 * Component
 */
const VolunteerCard: FC<NavigationInjectedProps & Props> = ({ navigation, date, title }) => {
  const buttonConfig: DeleteButtonConfig = {
    buttonType: 'delete',
    onEdit: () => navigation.navigate('AdminEditVolunteer'),
    onDelete: () => {},
  };
  return (
    <CardWithButtons buttonConfig={buttonConfig}>
      <HeadingContainer>
        <MaterialIcons name="person-outline" outline size={35} color={ColoursEnum.mustard} />
        <Heading2>{title}</Heading2>
      </HeadingContainer>
      <Description>{`Joined: ${date}`}</Description>
    </CardWithButtons>
  );
};

export default withNavigation(VolunteerCard);
