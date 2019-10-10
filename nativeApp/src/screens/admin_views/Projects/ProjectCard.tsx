import React, { FC } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import CardWithTitleAndDate from '../../../lib/ui/CardWithTitleAndDate';
import { ColoursEnum } from '../../../lib/ui/colours';
import { RemovalType } from '../../../lib/ui/CardWithButtons';
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
/*
 * Component
 */
const ProjectCard: FC<Props> = (props) => {
  const iconColour = props.removalType === 'archive' //eslint-disable-line
    ? ColoursEnum.mustard
    : ColoursEnum.orange;
  return (
    <CardWithTitleAndDate {...props} datePrefix="Created">
      <MaterialIcons name="assignment" outline size={35} color={iconColour} />
    </CardWithTitleAndDate>
  );
};

export default ProjectCard;
