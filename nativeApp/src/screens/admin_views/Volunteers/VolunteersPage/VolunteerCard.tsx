import React, { FC } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import CardWithTitleAndDate from '../../../../lib/ui/CardWithTitleAndDate';
import { ColoursEnum } from '../../../../lib/ui/colours';

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

/*
 * Component
 */
const VolunteerCard: FC<NavigationInjectedProps & Props> = ({ navigation, ...rest }) => (
  <CardWithTitleAndDate
    onPressOne={() => navigation.navigate('AdminEditVolunteer')}
    onPressTwo={() => {}}
    {...rest}
    datePrefix="Joined"
    removalType="delete"
  >
    <MaterialIcons name="person-outline" outline size={35} color={ColoursEnum.mustard} />
  </CardWithTitleAndDate>
);

export default withNavigation(VolunteerCard);
