import React, { FC, useState } from 'react';
import styled from 'styled-components/native';

import { MaterialIcons } from '@expo/vector-icons';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { ColoursEnum } from '../../../lib/ui/colours';
import CardWithButtons from '../../../lib/ui/CardWithButtons';
import { FontsEnum, Heading2 as H2 } from '../../../lib/ui/typography';
import useToggle from '../../../lib/hooks/useToggle';
import { ButtonConfig, ButtonType } from '../../../lib/ui/CardWithButtons/types';

/*
 * Types
 */
type Props = {
  id: number;
  title: string;
  date: string;
  buttonType: ButtonType;
}

/*
 * Styles
 */
const InputHeading = styled.TextInput`
  marginLeft: 5;
  fontSize: 25;
  color: ${ColoursEnum.darkGrey};
  fontFamily: ${FontsEnum.light};
  letterSpacing: 1.2;
`;

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

const getButtonConfig = (buttonType: ButtonType, active: boolean, buttonConfigs: ButtonConfig[]) => {
  switch (buttonType) {
    case 'restore':
      return buttonConfigs.find((x) => x.buttonType === 'restore');
    case 'archive':
    default:
      return active
        ? buttonConfigs.find((x) => x.buttonType === 'save')
        : buttonConfigs.find((x) => x.buttonType === 'archive');
  }
};

const getIconColor = (buttonType: ButtonType, active: boolean) => {
  switch (buttonType) {
    case 'restore':
      return ColoursEnum.darkGrey;
    case 'archive':
    default:
      return active ? ColoursEnum.purple : ColoursEnum.mustard;
  }
};


/*
 * Component
 */
const ProjectCard: FC<NavigationInjectedProps & Props> = ({ date, title, buttonType }) => {
  const [value, setValue] = useState(title);
  const { active, toggle } = useToggle(false);
  const iconColour = getIconColor(buttonType, active);
  const buttonConfigs: ButtonConfig[] = [{
    buttonType: 'save',
    onSave: toggle,
  },
  {
    buttonType: 'archive',
    onArchive: () => {},
    onEdit: toggle,
  },
  {
    buttonType: 'restore',
    onRestore: () => {},
  }];

  return (
    <CardWithButtons buttonConfig={getButtonConfig(buttonType, active, buttonConfigs)}>
      <HeadingContainer>
        <MaterialIcons name="assignment" outline size={35} color={iconColour} />
        {active
          ? <InputHeading selectTextOnFocus autoFocus onChangeText={setValue} value={value} />
          : <Heading2>{value}</Heading2>}
      </HeadingContainer>
      <Description>{`Created: ${date}`}</Description>
    </CardWithButtons>
  );
};

export default withNavigation(ProjectCard);
