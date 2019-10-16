import React, { FC } from 'react';
import styled from 'styled-components/native';

import { MaterialIcons } from '@expo/vector-icons';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { ColoursEnum } from '../../../../lib/ui/colours';
import CardWithButtons, { RemovalType } from '../../../../lib/ui/CardWithButtons';
import { FontsEnum } from '../../../../lib/ui/typography';

/*
 * Types
 */
type Props = {
  id: number;
  title: string;
  date: string;
  removalType: RemovalType;
}

/*
 * Styles
 */
const Heading2 = styled.TextInput`
  marginLeft: 5;
  fontSize: 25;
  color: ${ColoursEnum.darkGrey};
  fontFamily: ${FontsEnum.light};
  letterSpacing: 1.2;
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
const ProjectCard: FC<NavigationInjectedProps & Props> = ({ date, title, removalType }) => {
  const iconColour = removalType === 'archive' //eslint-disable-line
    ? ColoursEnum.mustard
    : ColoursEnum.darkGrey;
  return (
    <CardWithButtons
      onPressOne={() => {}}
      onPressTwo={() => {}}
      removalType={removalType}
    >
      <HeadingContainer>
        <MaterialIcons name="assignment" outline size={35} color={iconColour} />
        <Heading2 selectTextOnFocus>{title}</Heading2>
      </HeadingContainer>
      <Description>{`Created: ${date}`}</Description>
    </CardWithButtons>
  );
};

export default withNavigation(ProjectCard);
